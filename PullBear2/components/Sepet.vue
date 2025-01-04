<!-- Sepet.vue -->
<template>
    <div class="cart-container">
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
          <h2>Sepet</h2>
          <button @click="toggleCart" class="close-button">Kapat</button>
        </div>
        <div class="cart-panel-content">
          <p v-if="cartItems.length === 0" class="empty-cart-message">Sepetiniz boş.</p>
          <div v-else>
            <div class="cart-items-container">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img :src="item.image" :alt="item.name" class="cart-item-image" />
                <div class="cart-item-details">
                  <h3>{{ item.name }}</h3>
                  <p class="cart-item-price">{{ item.totalPrice }} TL</p>
                  <div class="quantity-controls">
                    <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
                  </div>
                  <button @click="removeFromCart(item.id)" class="remove-item-btn">Kaldır</button>
                </div>
              </div>
            </div>
            
            <div class="cart-summary">
              <p class="total-amount">Toplam Tutar: {{ calculateTotal }} TL</p>
              <button @click="clearCart" class="clear-cart-btn">Sepeti Boşalt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { collection, query, getDocs, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'

const { $db } = useNuxtApp()
const isCartOpen = ref(false)
const cartItems = ref([])

// Toplam ürün adedi
const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.quantity || 1), 0)
})

// Sepet panelini açıp kapatan fonksiyon
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

// Toplam tutarı hesaplayan computed property
const calculateTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.totalPrice || item.price), 0)
})

// Ürün miktarını artır
const increaseQuantity = async (item) => {
  try {
    const newQuantity = (item.quantity || 1) + 1
    await updateDoc(doc($db, 'cart', item.id), {
      quantity: newQuantity,
      totalPrice: newQuantity * item.price
    })
  } catch (error) {
    console.error('Miktar artırılırken hata oluştu:', error)
    alert('İşlem sırasında bir hata oluştu.')
  }
}

// Ürün miktarını azalt
const decreaseQuantity = async (item) => {
  try {
    if (item.quantity <= 1) {
      await removeFromCart(item.id)
      return
    }
    
    const newQuantity = item.quantity - 1
    await updateDoc(doc($db, 'cart', item.id), {
      quantity: newQuantity,
      totalPrice: newQuantity * item.price
    })
  } catch (error) {
    console.error('Miktar azaltılırken hata oluştu:', error)
    alert('İşlem sırasında bir hata oluştu.')
  }
}

// Sepeti yükle ve değişiklikleri dinle
const loadCart = () => {
  const cartRef = collection($db, 'cart')
  
  const unsubscribe = onSnapshot(cartRef, (snapshot) => {
    cartItems.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }, (error) => {
    console.error('Sepet dinlenirken hata oluştu:', error)
  })

  onUnmounted(() => unsubscribe())
}

// Sepetten ürün kaldır
const removeFromCart = async (itemId) => {
  try {
    await deleteDoc(doc($db, 'cart', itemId))
  } catch (error) {
    console.error('Ürün kaldırılırken hata oluştu:', error)
    alert('Ürün kaldırılırken bir hata oluştu.')
  }
}

// Sepeti temizle
const clearCart = async () => {
  try {
    const deletePromises = cartItems.value.map(item => 
      deleteDoc(doc($db, 'cart', item.id))
    )
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Sepet temizlenirken hata oluştu:', error)
    alert('Sepet temizlenirken bir hata oluştu.')
  }
}

// Component yüklendiğinde sepeti yükle
onMounted(() => {
  loadCart()
})
</script>
  
<style scoped>
.cart-container {
  position: fixed;
  right: 0px;
  top: 15px;
  z-index: 998;
}

#buttonShopCart {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.button-text .count {
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 9998;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.cart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.close-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
}

.cart-panel-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.cart-panel.open {
  transform: translateX(0);
}

.cart-items-container {
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: start;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.cart-item-image {
  width: 80px;
  height: 120px;
  object-fit: cover;
  margin-right: 15px;
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h3 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.cart-item-price {
  font-weight: bold;
  margin: 5px 0;
}

.remove-item-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.cart-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.clear-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.clear-cart-btn:hover {
  background-color: #333;
}

.empty-cart-message {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin: 20px 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.quantity-btn {
  background-color: #eee;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #ddd;
}

.quantity {
  font-size: 14px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}
</style>
  