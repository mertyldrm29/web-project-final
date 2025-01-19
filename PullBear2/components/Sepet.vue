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
          <span class="count">Sepet ({{ totalItems }})</span>
        </span>
        
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
              <p>Beden: {{ item.size }}</p>
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

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { useNuxtApp } from '#app'
import type { Firestore } from 'firebase/firestore'

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  totalPrice: number;
  userId: string;
  productId: string;
}

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const cartStore = useCartStore()
const authStore = useAuthStore()
const { loggedInUser } = storeToRefs(authStore)
const { cartItems, isCartOpen, loading, error } = storeToRefs(cartStore)

const totalItems = computed(() => cartStore.totalItems)
const calculateTotal = computed(() => cartStore.totalAmount)
const canPlaceOrder = computed(() => cartItems.value?.length > 0 && loggedInUser.value)

const toggleCart = (): void => {
  if (!loggedInUser.value && isCartOpen.value) {
    cartStore.toggleCart(false)
    return
  }
  cartStore.toggleCart()
}

const increaseQuantity = async (item: CartItem): Promise<void> => {
  try {
    const { $db } = useNuxtApp()
    await cartStore.increaseQuantity($db as Firestore, item)
  } catch (error) {
    alert('Bu ürünün stoğu tükenmiştir!')
  }
}

const decreaseQuantity = async (item: CartItem): Promise<void> => {
  const { $db } = useNuxtApp()
  await cartStore.decreaseQuantity($db as Firestore, item)
}

const removeFromCart = async (item: CartItem): Promise<void> => {
  const { $db } = useNuxtApp()
  await cartStore.removeFromCart($db as Firestore, item)
}

const clearCart = async (): Promise<void> => {
  try {
    const { $db } = useNuxtApp()
    const userId = loggedInUser.value?.id || '1'
    await cartStore.clearCart($db as Firestore, userId)
    alert('Sepetiniz temizlendi!')
  } catch (error) {
    console.error('Sepet temizlenirken hata:', error)
    alert('Sepet temizlenirken bir hata oluştu!')
  }
}

const placeOrder = async (): Promise<void> => {
  if (!loggedInUser.value) {
    alert('Sipariş vermek için lütfen giriş yapınız.')
    cartStore.toggleCart(false)
    return
  }

  if (cartItems.value.length === 0) {
    alert('Sepetiniz boş!')
    return
  }

  const { $db } = useNuxtApp()
  const success = await cartStore.placeOrder($db as Firestore, loggedInUser.value.id)
  
  if (success) {
    cartStore.toggleCart(false)
    alert('Siparişiniz başarıyla oluşturuldu!')
  } else {
    alert('Sipariş oluşturulurken bir hata oluştu!')
  }
}

onMounted(async () => {
  try {
    const { $db } = useNuxtApp()
    const savedUser = localStorage.getItem('loggedInUser')
    
    if (savedUser) {
      const user = JSON.parse(savedUser) as User
      authStore.setUser(user)
      await cartStore.setupCartListener($db as Firestore, user.id)
      await cartStore.checkAndUpdateCart($db as Firestore, user.id)
    } else {
      await cartStore.setupCartListener($db as Firestore, '1')
    }
  } catch (error) {
    console.error('Component mount hatası:', error)
  }
})

onBeforeUnmount(() => {
  if (cartStore.unsubscribe) {
    cartStore.unsubscribe()
  }
})
</script>

<style scoped>
.c-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: fixed;
  top: 55px;
  right: 0px;
  z-index: 1000;

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
}
</style>
