<template>
     <div class="logo-container">
        <NuxtLink to="/">
      <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
    </NuxtLink>
    </div>
    <Menu />
<Search 
   :isIndex="false"
   :isJeans="true"
   :isNewProducts="false"
   @search="handleSearch"
 />
<div class="men-page">
 <h1>Erkek Sweatshirt & Kazak</h1>
    </div>
<div class="content">
    <div class="products-section">
        <Filter6 @filter-changed="handleFilterChange" />
   <Products 
     :products="filteredProducts" 
     @add-to-cart="handleAddToCart"
   />
 </div>
    </div>
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { collection, query, getDocs, addDoc, updateDoc, doc, where, Firestore } from 'firebase/firestore'
import { useNotification } from '~/composables/useNotification'
import { useError } from '~/composables/useError'

import Menu from '../../../components/Menu.vue'
import Filter6 from '../../../components/Filter6.vue'
import Products from '../../../components/Products.vue'
import Button from '../../../components/Button.vue'
import Sepet from '../../../components/Sepet.vue'
import Footer from '../../../components/Footer.vue'
import Search from '../../../components/Search.vue'

import { useProductStore } from '~/stores/products'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import type { Product } from '~/stores/products'
import type { User, Order, OrderItem } from '~/stores/auth'
import type { CartItem } from '~/stores/cart'

const productStore = useProductStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { $db } = useNuxtApp()
const router = useRouter()

const { filteredProducts } = storeToRefs(productStore)
const { loggedInUser } = storeToRefs(authStore)
const { cartItems, isCartOpen } = storeToRefs(cartStore)
const loading = ref<boolean>(true)

const notification = useNotification()
const { handleError } = useError()

// Initialize products array
const products = ref<Product[]>([])
const selectedFilter = ref<string>('all')
const chosenFilter = ref<string>('all')

const safeFilteredProducts = computed(() => {
  if (!filteredProducts.value) return []
  return filteredProducts.value
})

const handleFilterChange = (filter6: string): void => {
  selectedFilter.value = filter6
  productStore.setFilters('sweatshirts', 'men', filter6)
}

const handleUserLogin = async (user: User): Promise<void> => {
  try {
    const db = $db as Firestore
    await authStore.loginUser(db, user)
    if (user && user.id) {
      await cartStore.setupCartListener(db, user.id)
      await cartStore.checkAndUpdateCart(db, user.id)
    }
  } catch (error) {
    handleError(error, 'Kullanıcı girişi yapılamadı')
  }
}

const handleUserLogout = async (): Promise<void> => {
  try {
    await authStore.logoutUser()
    cartStore.toggleCart(false)
    await cartStore.setupCartListener($db as Firestore, '1')
  } catch (error) {
    handleError(error, 'Çıkış işlemi başarısız oldu')
  }
}

const handleRegister = async (user: User): Promise<void> => {
  try {
    await authStore.registerUser($db as Firestore, user)
    notification.success('Kayıt başarılı! Giriş yapabilirsiniz.')
  } catch (error) {
    handleError(error, 'Kayıt işlemi başarısız oldu')
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
    handleError(error, 'Ürün miktarı güncellenemedi')
  }
}

const handleRemoveFromCart = async (item: CartItem): Promise<void> => {
  try {
    await cartStore.removeFromCart($db as Firestore, item)
  } catch (error) {
    handleError(error, 'Ürün sepetten kaldırılamadı')
  }
}

const handleClearCart = async (): Promise<void> => {
  try {
    const userId = loggedInUser.value?.id || '1'
    await cartStore.clearCart($db as Firestore, userId)
  } catch (error) {
    handleError(error, 'Sepet temizlenemedi')
  }
}

const handleAddToCart = async (product: Product): Promise<void> => {
  try {
    const userId = loggedInUser.value?.id || '1'
    await cartStore.addToCart($db as Firestore, userId, product)
    notification.success('Ürün sepete eklendi!')
  } catch (error) {
    handleError(error, 'Ürün sepete eklenemedi')
  }
}

const handleOpenOrders = async (): Promise<void> => {
  try {
    loading.value = true
    await authStore.loadUserOrders($db as Firestore)
  } catch (error) {
    handleError(error, 'Siparişler yüklenemedi')
  } finally {
    loading.value = false
  }
}

const handleOpenReturns = async (): Promise<void> => {
  try {
    loading.value = true
    await authStore.loadUserReturns($db as Firestore)
  } catch (error) {
    handleError(error, 'İadeler yüklenemedi')
  } finally {
    loading.value = false
  }
}

const handleOpenCustomerService = async (): Promise<void> => {
  try {
    loading.value = true
    await authStore.loadCustomerServices($db as Firestore)
  } catch (error) {
    handleError(error, 'Müşteri hizmetleri yüklenemedi')
  } finally {
    loading.value = false
  }
}

const handleReturnItem = async (order: Order, item: OrderItem): Promise<void> => {
  try {
    loading.value = true
    await authStore.returnOrderItem($db as Firestore, order, item)
    await handleOpenOrders()
    await handleOpenReturns()
    notification.success('Ürün iade işlemi başarıyla tamamlandı.')
  } catch (error) {
    handleError(error, 'Ürün iade işlemi başarısız oldu')
  } finally {
    loading.value = false
  }
}

const handleReturnEntireOrder = async (order: Order): Promise<void> => {
  try {
    loading.value = true
    await authStore.returnEntireOrder($db as Firestore, order)
    await handleOpenOrders()
    await handleOpenReturns()
    notification.success('Sipariş iade işlemi başarıyla tamamlandı.')
  } catch (error) {
    handleError(error, 'Sipariş iade işlemi başarısız oldu')
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
    const db = $db as Firestore
    await productStore.fetchProducts(db)
    productStore.setFilters('sweatshirts', 'men', 'all')
    
    const userId = loggedInUser.value?.id || '1'
    await cartStore.setupCartListener(db, userId)
    await authStore.loadUserOrders(db)
    await authStore.loadUserReturns(db)
    await authStore.loadCustomerServices(db)
  } catch (error) {
    handleError(error, 'Sayfa yüklenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.men-page {
    align-items: center;
    justify-content: center;
    display: flex;
margin-top: 0px;
}

h1 {
font-size: 1.5em;
    margin-bottom: 10px;
color: rgb(100, 99, 99);
}

.content {
width: 100%;
}

.filter-section {
margin-bottom: 20px;
}

.products-section {
    width: 100%;
}

.logo-container {
margin-top: 0px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.menu-container {
  margin-top: -20px;
  position: relative;
}

.logo {
max-width: 200px;
}
</style>