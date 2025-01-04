<!-- Sepet.vue -->
<template>
  <div>
    <!-- Sepet İkonu ve Yazısı -->
    <button
      type="button"
      id="buttonShopCart"
      class="c-button c-button--basket"
      aria-label="Sepeti görüntüle"
      @click="toggleCart"
    >
      <span class="button-text">
        <span class="icon icon-nav-shop">
          <svg role="presentation" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 9H20L19.1654 18.1811C19.0717 19.2112 18.208 20 17.1736 20H6.82643C5.79202 20 4.92829 19.2112 4.83464 18.1811L4 9Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linejoin="round"
            ></path>
            <path
              d="M8 11V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V11"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>
          </svg>
        </span>
        <span class="count">Sepet ({{ totalItems }})</span>
      </span>
    </button>

    <!-- Sepet Paneli -->
    <div :class="['cart-panel', { open: isCartOpen }]">
      <div class="cart-panel-header">
        <h2>Sepetim</h2>
        <button @click="toggleCart" class="close-button">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="cart-panel-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Sepetiniz boş</p>
        </div>
        <div v-else>
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="cart-item-image">
            <div class="cart-item-details">
              <h3>{{ item.name }}</h3>
              <p>Fiyat: {{ item.price }} TL</p>
              <div class="quantity-controls">
                <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
              </div>
              <p>Toplam: {{ item.totalPrice }} TL</p>
              <button @click="removeFromCart(item)" class="remove-btn">Kaldır</button>
            </div>
          </div>
          <div class="cart-summary">
            <p class="total">Toplam Tutar: {{ calculateTotal }} TL</p>
            <button @click="clearCart" class="clear-cart-btn">Sepeti Temizle</button>
            <button @click="placeOrder" class="order-btn" :disabled="!canPlaceOrder">
              Sipariş Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNuxtApp } from '#app';

export default {
  data() {
    return {
      cartItems: [],
      isCartOpen: false,
      unsubscribe: null,
      loggedInUser: null
    };
  },
  computed: {
    calculateTotal() {
      return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
    },
    canPlaceOrder() {
      return this.cartItems.length > 0 && this.loggedInUser;
    },
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
  },
  methods: {
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },
    setupCartListener() {
      const { $db } = useNuxtApp();
      const cartRef = collection($db, 'cart');
      
      // Önceki listener'ı temizle
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      // Yeni listener ekle
      this.unsubscribe = onSnapshot(cartRef, (snapshot) => {
        this.cartItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }, (error) => {
        console.error('Sepet dinlenirken hata:', error);
      });
    },
    async increaseQuantity(item) {
      try {
        const { $db } = useNuxtApp();
        const newQuantity = item.quantity + 1;
        const newTotalPrice = item.price * newQuantity;
        
        await updateDoc(doc($db, 'cart', item.id), {
          quantity: newQuantity,
          totalPrice: newTotalPrice
        });
        
        await this.loadCart();
      } catch (error) {
        console.error('Miktar artırılırken hata:', error);
      }
    },
    async decreaseQuantity(item) {
      if (item.quantity <= 1) return;
      
      try {
        const { $db } = useNuxtApp();
        const newQuantity = item.quantity - 1;
        const newTotalPrice = item.price * newQuantity;
        
        await updateDoc(doc($db, 'cart', item.id), {
          quantity: newQuantity,
          totalPrice: newTotalPrice
        });
        
        await this.loadCart();
      } catch (error) {
        console.error('Miktar azaltılırken hata:', error);
      }
    },
    async removeFromCart(item) {
      try {
        const { $db } = useNuxtApp();
        await deleteDoc(doc($db, 'cart', item.id));
        await this.loadCart();
      } catch (error) {
        console.error('Ürün sepetten kaldırılırken hata:', error);
      }
    },
    async clearCart() {
      try {
        const { $db } = useNuxtApp();
        const promises = this.cartItems.map(item => 
          deleteDoc(doc($db, 'cart', item.id))
        );
        await Promise.all(promises);
        await this.loadCart();
      } catch (error) {
        console.error('Sepet temizlenirken hata:', error);
      }
    },
    async placeOrder() {
      if (!this.loggedInUser) {
        alert('Sipariş vermek için lütfen giriş yapınız.');
        return;
      }

      if (this.cartItems.length === 0) {
        alert('Sepetiniz boş!');
        return;
      }

      try {
        const { $db } = useNuxtApp();
        
        // Siparişi oluştur
        const order = {
          userId: this.loggedInUser.id,
          items: this.cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            totalPrice: item.totalPrice
          })),
          totalAmount: this.calculateTotal,
          orderDate: new Date(),
          status: 'completed'
        };

        // Siparişi Firestore'a kaydet
        await addDoc(collection($db, 'orders'), order);

        // Sepeti temizle
        await this.clearCart();

        // Sepet panelini kapat
        this.isCartOpen = false;

        alert('Siparişiniz Alındı.');
      } catch (error) {
        console.error('Sipariş oluşturulurken hata:', error);
        alert('Sipariş oluşturulurken bir hata oluştu.');
      }
    },
    checkLoggedInUser() {
      const savedUser = localStorage.getItem('loggedInUser');
      if (savedUser) {
        this.loggedInUser = JSON.parse(savedUser);
      }
    },
    handleUserLogin(user) {
      this.loggedInUser = user;
    },
    handleUserLogout() {
      this.loggedInUser = null;
    }
  },
  mounted() {
    this.setupCartListener();
    this.checkLoggedInUser();
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
</script>

<style scoped>
.c-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: fixed;
  top: 10px;
  right: 0px;
  z-index: 998;
}

.button-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  font-size: 16px;
  font-weight: bold;
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.cart-panel.open {
  transform: translateX(0);
}

.cart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.cart-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.cart-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.cart-item-image {
  width: 100px;
  height: 150px;
  object-fit: cover;
  margin-right: 20px;
}

.cart-item-details {
  flex-grow: 1;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.quantity-btn {
  padding: 5px 10px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn {
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.total {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.clear-cart-btn {
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.order-btn {
  padding: 10px 20px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.order-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #666;
}

.close-button:hover {
  color: #000;
}
</style>
  