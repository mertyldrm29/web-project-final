<template>
  <div class="new-page">
    <div class="logo-container">
         <NuxtLink to="/">
       <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
     </NuxtLink>
      
     </div>
     <Menu :isNewProducts="true" />
    <Search 
      :isIndex="false"
      :isJeans="false"
      :isNewProducts="true"
      @search="handleSearch"
    />
       <h1>Yeni Ürünler</h1>
    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>
    <div v-else-if="error" class="error">
      Bir hata oluştu: {{ error }}
     </div>
    <template v-else>
     <div class="content">
       <div class="products-section">
         <Filter2 @filter-changed="handleFilterChange2" />
         <Filter @filter-changed="handleFilterChange" />
          <Products 
            :products="filteredProducts" 
            @add-to-cart="handleAddToCart"
          />
       </div>
     </div>
    </template>
    <Button 
      :user="loggedInUser" 
      @return-item="handleReturnItem" 
      @return-entire-order="handleReturnEntireOrder" 
      @open-orders="handleOpenOrders" 
      @open-returns="handleOpenReturns" 
      @open-customer-service="handleOpenCustomerService" 
      @login="handleUserLogin" 
      @register="handleRegister" 
      @logout="handleUserLogout" 
    />
    <Sepet 
      :cart-items="cartItems" 
      :is-cart-open="isCartOpen" 
      @toggle-cart="handleToggleCart" 
      @update-quantity="handleUpdateQuantity" 
      @remove-from-cart="handleRemoveFromCart" 
      @clear-cart="handleClearCart" 
    />
     <Footer />
  </div>
 </template>
 
 <script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useNuxtApp } from '#app'
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Firestore } from 'firebase/firestore'
import { useRouter } from 'vue-router'

// Import components
import Menu from '@/components/Menu.vue'
import Filter from '@/components/Filter.vue'
import Filter2 from '@/components/Filter2.vue'
import Products from '@/components/Products.vue'
import Button from '@/components/Button.vue'
import Sepet from '@/components/Sepet.vue'
import Footer from '@/components/Footer.vue'
import Search from '@/components/Search.vue'

interface User {
  id: string
  email: string
  name: string
  surname: string
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  sizes: Record<string, number>
  gender: string
  subTshirt?: string
  subJeans?: string
  subJackets?: string
  subSweatshirts?: string
}

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  totalPrice: number
  image: string
  isReturned?: boolean
}

interface Order {
  id: string
  orderDate: Date
  items: OrderItem[]
  totalAmount: number
}

interface CartItem {
  id: string
  userId: string
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  totalPrice: number
  image: string
  selectedSize: string
}

interface ButtonEmits {
  (e: 'return-item', order: { id: string; orderDate: Date; items: OrderItem[]; totalAmount: number }, item: OrderItem): void
  (e: 'return-entire-order', order: { id: string; orderDate: Date; items: OrderItem[]; totalAmount: number }): void
  (e: 'open-orders'): void
  (e: 'open-returns'): void
  (e: 'open-customer-service'): void
  (e: 'login', user: User): void
  (e: 'register', user: User): void
  (e: 'logout'): void
}

type ErrorType = Error | unknown

const productStore = useProductStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { $db } = useNuxtApp()
const router = useRouter()

const { filteredProducts } = storeToRefs(productStore)
const { loggedInUser } = storeToRefs(authStore)
const { cartItems, isCartOpen } = storeToRefs(cartStore)

const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const products = ref<Product[]>([])
const selectedFilter = ref<string>('all')
const chosenFilter = ref<string>('all')

const safeFilteredProducts = computed(() => {
  if (!filteredProducts.value) return []
  return filteredProducts.value
})

const handleFilterChange = (filter: string): void => {
  selectedFilter.value = filter
  if (filter === 'all') {
    productStore.setFilters('all', chosenFilter.value, 'all')
  } else {
    productStore.setFilters(filter, chosenFilter.value, 'all')
  }
}

const handleFilterChange2 = (filter2: string): void => {
  chosenFilter.value = filter2
  if (filter2 === 'all') {
    productStore.setFilters(selectedFilter.value, 'all', 'all')
  } else {
    productStore.setFilters(selectedFilter.value, filter2, 'all')
  }
}

const handleUserLogin = async (user: User): Promise<void> => {
  try {
    await authStore.loginUser($db as Firestore, user)
    if (user && user.id) {
      await cartStore.setupCartListener($db as Firestore, user.id)
      await cartStore.checkAndUpdateCart($db as Firestore, user.id)
    }
  } catch (err) {
    console.error('Login error:', err)
    alert('Giriş yapılırken bir hata oluştu.')
  }
}

const handleUserLogout = async (): Promise<void> => {
  try {
    await authStore.logoutUser()
    cartStore.toggleCart(false)
    await cartStore.setupCartListener($db as Firestore, '1')
  } catch (err) {
    console.error('Logout error:', err)
    alert('Çıkış yapılırken bir hata oluştu.')
  }
}

const handleRegister = async (user: User): Promise<void> => {
  try {
    await authStore.registerUser($db as Firestore, user)
    alert('Kayıt başarılı! Giriş yapabilirsiniz.')
  } catch (err) {
    console.error('Register error:', err)
    alert('Kayıt olurken bir hata oluştu.')
  }
}

const handleToggleCart = (): void => {
  cartStore.toggleCart()
}

const handleUpdateQuantity = async (item: CartItem, change: number): Promise<void> => {
  try {
    const db = $db as Firestore
    if (change > 0) {
      await cartStore.increaseQuantity(db, item)
    } else {
      await cartStore.decreaseQuantity(db, item)
    }
  } catch (error) {
    console.error('Update quantity error:', error)
    alert('Miktar güncellenirken bir hata oluştu.')
  }
}

const handleRemoveFromCart = async (item: CartItem): Promise<void> => {
  try {
    await cartStore.removeFromCart($db as Firestore, item)
  } catch (err) {
    console.error('Remove from cart error:', err)
    alert('Ürün sepetten çıkarılırken bir hata oluştu.')
  }
}

const handleClearCart = async (): Promise<void> => {
  try {
    const userId = loggedInUser.value?.id || '1'
    await cartStore.clearCart($db as Firestore, userId)
  } catch (err) {
    console.error('Clear cart error:', err)
    alert('Sepet temizlenirken bir hata oluştu.')
  }
}

const handleAddToCart = async (product: Product): Promise<void> => {
  try {
    const userId = loggedInUser.value?.id || '1'
    await cartStore.addToCart($db as Firestore, userId, product)
    alert('Ürün sepete eklendi!')
  } catch (err) {
    if (err instanceof Error && err.message === 'Bu ürünün stoğu tükenmiştir!') {
      alert('Bu ürünün stoğu tükenmiştir!')
    } else {
      console.error('Add to cart error:', err)
      alert('Ürün sepete eklenirken bir hata oluştu.')
    }
  }
}

const handleOpenOrders = async (): Promise<void> => {
  try {
    loading.value = true
    await authStore.loadUserOrders($db as Firestore)
  } catch (err) {
    console.error('Load orders error:', err)
    alert('Siparişler yüklenirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

const handleOpenReturns = async (): Promise<void> => {
  try {
    loading.value = true
    await authStore.loadUserReturns($db as Firestore)
  } catch (err) {
    console.error('Load returns error:', err)
    alert('İadeler yüklenirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

const handleOpenCustomerService = async (): Promise<void> => {
  try {
    loading.value = true
    await authStore.loadCustomerServices($db as Firestore)
  } catch (err) {
    console.error('Load customer service error:', err)
    alert('Müşteri hizmetleri yüklenirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

const handleReturnItem = async (
  order: { id: string; orderDate: Date; items: OrderItem[]; totalAmount: number }, 
  item: OrderItem
): Promise<void> => {
  try {
    loading.value = true
    await authStore.returnOrderItem($db as Firestore, order as Order, item)
    await handleOpenOrders()
    await handleOpenReturns()
    alert('Ürün iade işlemi başarıyla tamamlandı.')
  } catch (err) {
    console.error('Return item error:', err)
    alert('Ürün iade edilirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

const handleReturnEntireOrder = async (
  order: { id: string; orderDate: Date; items: OrderItem[]; totalAmount: number }
): Promise<void> => {
  try {
    loading.value = true
    await authStore.returnEntireOrder($db as Firestore, order as Order)
    await handleOpenOrders()
    await handleOpenReturns()
    alert('Sipariş iade işlemi başarıyla tamamlandı.')
  } catch (err) {
    console.error('Return order error:', err)
    alert('Sipariş iade edilirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

const handleSearch = async (query: string): Promise<void> => {
  router.push({
    path: '/search',
    query: { q: query }
  })
}

onMounted(async () => {
  try {
    loading.value = true
    await productStore.fetchProducts($db as Firestore)
    productStore.setFilters('all', 'all', 'all')
    
    const userId = loggedInUser.value?.id || '1'
    await cartStore.setupCartListener($db as Firestore, userId)
  } catch (err: ErrorType) {
    console.error('Mounted error:', err)
    error.value = err instanceof Error ? err.message : 'Bir hata oluştu'
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (cartStore.unsubscribe) {
    cartStore.unsubscribe()
  }
})

 </script>
 
 <style scoped>
 .logo-container {
   margin-top: 0px;
   display: flex;
   justify-content: center;
   width: 100%;
 }
.new-page {
  padding: 20px;
  margin: 0 auto;
}

.logo-container {
  margin-bottom: 20px;
 }
 .logo {
   max-width: 200px;
 }
.content {
  width: 100%;
}

.products-section {
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.loading, .error, .no-products {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  font-size: 1.2em;
}

.error {
  color: red;
}

.no-products {
  color: #666;
 }
 </style> 