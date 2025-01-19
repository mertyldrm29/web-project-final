<template>
  <div class="home-page">
    <div class="logo-container">
      <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
    </div>
    <Menu :isNewProducts="false" />
    <Search 
      :isIndex="true"
      :isJeans="false"
      :isNewProducts="false"
      @search="handleSearch"
    />
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
    <ImageWithButton />
    <Carousel />
    <Influencer />
    <Video />
    <Subscription 
      @subscribe="handleSubscribe"
      @unsubscribe="handleUnsubscribe"
    />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { collection, query, getDocs, addDoc, updateDoc, doc, where, deleteDoc, type Firestore } from 'firebase/firestore'
import { useRouter } from 'vue-router'

interface Product {
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

interface Order {
  id: string;
  orderDate: Date;
  items: OrderItem[];
  totalAmount: number;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  totalPrice: number;
  image: string;
  isReturned?: boolean;
}

const { $db } = useNuxtApp()
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const { loggedInUser } = storeToRefs(authStore)
const { cartItems, isCartOpen } = storeToRefs(cartStore)

const searchResults = ref<Product[]>([])
const searchLoading = ref<boolean>(false)
const loading = ref<boolean>(false)

onMounted(async () => {
  try {
    loading.value = true
    const userId = loggedInUser.value?.id || '1'
    await cartStore.setupCartListener($db as Firestore, userId)
    await cartStore.checkAndUpdateCart($db as Firestore, userId)
    await authStore.loadUserOrders($db as Firestore)
    await authStore.loadUserReturns($db as Firestore)
    await authStore.loadCustomerServices($db as Firestore)
  } catch (err) {
    console.error('Mounted error:', err)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (cartStore.unsubscribe) {
    cartStore.unsubscribe()
  }
})

const handleSearch = async (query: string): Promise<void> => {
  router.push({
    path: '/search',
    query: { q: query }
  })
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

const handleUpdateQuantity = async (item: Product, change: number): Promise<void> => {
  try {
    if (change > 0) {
      await cartStore.increaseQuantity($db as Firestore, item)
    } else if (change < 0) {
      await cartStore.decreaseQuantity($db as Firestore, item)
    }
  } catch (err) {
    console.error('Update quantity error:', err)
    alert('Miktar güncellenirken bir hata oluştu.')
  }
}

const handleRemoveFromCart = async (item: Product): Promise<void> => {
  try {
    const userId = loggedInUser.value?.id || '1'
    await cartStore.removeFromCart($db as Firestore, item)
    await cartStore.checkAndUpdateCart($db as Firestore, userId)
    await cartStore.setupCartListener($db as Firestore, userId)
  } catch (err) {
    console.error('Remove from cart error:', err)
    alert('Ürün sepetten çıkarılırken bir hata oluştu.')
  }
}

const handleClearCart = async (): Promise<void> => {
  try {
    const userId = loggedInUser.value?.id || '1'
    await cartStore.clearCart($db as Firestore, userId)
    await cartStore.checkAndUpdateCart($db as Firestore, userId)
    await cartStore.setupCartListener($db as Firestore, userId)
    alert('Sepet başarıyla temizlendi!')
  } catch (err) {
    console.error('Clear cart error:', err)
    alert('Sepet temizlenirken bir hata oluştu.')
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

const handleReturnItem = async (order: Order, item: OrderItem): Promise<void> => {
  try {
    loading.value = true
    await authStore.returnOrderItem($db as Firestore, order, item)
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

const handleReturnEntireOrder = async (order: Order): Promise<void> => {
  try {
    loading.value = true
    await authStore.returnEntireOrder($db as Firestore, order)
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

const handleSubscribe = async (email: string): Promise<void> => {
  try {
    const subscribersRef = collection($db as Firestore, 'subscribers')
    const q = query(subscribersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      alert('Bu email adresi zaten kayıtlı!')
      return
    }

    await addDoc(subscribersRef, {
      email,
      subscriptionDate: new Date()
    })

    alert('Bültenimize başarıyla abone oldunuz!')
  } catch (err) {
    console.error('Subscribe error:', err)
    alert('Abonelik işlemi sırasında bir hata oluştu.')
  }
}

const handleUnsubscribe = async (email: string): Promise<void> => {
  try {
    const subscribersRef = collection($db as Firestore, 'subscribers')
    const q = query(subscribersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      alert('Bültenimizde kayıtlı değilsiniz!')
      return
    }

    const docRef = doc($db as Firestore, 'subscribers', querySnapshot.docs[0].id)
    await deleteDoc(docRef)
    alert('Bülten aboneliğiniz başarıyla iptal edildi!')
  } catch (err) {
    console.error('Unsubscribe error:', err)
    alert('Abonelik iptali sırasında bir hata oluştu.')
  }
}
</script>

<style scoped>
.home-page {
  padding: 0px;
  text-align: center;
  position: relative;
}

.logo-container {
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  top: 50px;
  z-index: 999;
}

.logo {
  max-width: 200px;
}

/* Mobil Tasarım */
@media screen and (max-width: 768px) {
  .home-page {
    padding: 0;
  }

  .logo-container {
    position: fixed;
    top: 20px;
    padding: 10px;
  }

  .logo {
    max-width: 150px;
  }
}

/* Küçük Mobil Cihazlar */
@media screen and (max-width: 480px) {
  .logo-container {
    top: 10px;
  }

  .logo {
    max-width: 120px;
  }
}
</style> 