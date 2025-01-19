<template>
  <div class="search-page">
    <div class="logo-container">
      <NuxtLink to="/">
        <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
      </NuxtLink>
    </div>
    <Menu />
    <div class="search-wrapper">
      <Search 
        :isIndex="false"
        :isJeans="false"
        @search="handleSearch"
      />
    </div>
    
    <!-- Arama Sonuçları -->
    <div class="search-content">
      <h1 class="search-title" v-if="searchQuery">
        "{{ searchQuery }}" için arama sonuçları
      </h1>
      
      <div v-if="loading" class="loading">
        Aranıyor...
      </div>

      <div v-else-if="searchResults.length === 0 && searchQuery" class="no-results">
        Arama kriterinize uygun ürün bulunamadı.
      </div>

      <div v-else-if="searchResults.length > 0" class="search-results">
        <div class="results-grid">
          <div v-for="product in searchResults" :key="product.id" class="product-card">
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <div class="size-selector">
                <select v-model="selectedSizes[product.id]" class="size-select">
                  <option value="" disabled>Beden Seçin</option>
                  <option v-for="(stock, size) in product.sizes" 
                          :key="size" 
                          :value="size"
                          :disabled="stock === 0">
                    {{ size }} {{ stock === 0 ? '(Tükendi)' : '(Mevcut)' }}
                  </option>
                </select>
              </div>
              <button @click="handleAddToCart(product)" 
                      class="add-to-cart-btn"
                      :disabled="!selectedSizes[product.id]">
                {{ !selectedSizes[product.id] ? 'Beden Seçin' : 'Sepete Ekle' }}
              </button>
              <p class="price">{{ product.price }} TL</p>
              <p class="gender">{{ product.gender === 'men' ? 'Erkek' : 'Kadın' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Sepet 
      :cart-items="cartItems" 
      :is-cart-open="isCartOpen" 
      @toggle-cart="handleToggleCart" 
      @update-quantity="handleUpdateQuantity" 
      @remove-from-cart="handleRemoveFromCart" 
      @clear-cart="handleClearCart" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { useProductStore } from '~/stores/products'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'
import { collection, getDocs, onSnapshot, doc, Firestore } from 'firebase/firestore'

interface Product {
  firestoreId: string
  id: string
  name: string
  price: number
  image: string
  gender: string
  sizes: Record<string, number>
  subTshirt?: string
  subJeans?: string
  subJackets?: string
  subSweatshirts?: string
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

const route = useRoute()
const { $db } = useNuxtApp()
const productStore = useProductStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

const { loggedInUser } = storeToRefs(authStore)
const { cartItems, isCartOpen } = storeToRefs(cartStore)

const searchQuery = ref<string>('')
const searchResults = ref<Product[]>([])
const loading = ref<boolean>(false)
const selectedSizes = ref<Record<string, string>>({})

const searchProducts = async (queryText: string): Promise<void> => {
  if (!queryText) return

  loading.value = true
  searchResults.value = []

  try {
    const productsRef = collection($db as Firestore, 'products')
    const querySnapshot = await getDocs(productsRef)
    const allProducts: Product[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Product, 'firestoreId'>
      allProducts.push({
        firestoreId: doc.id,
        id: data.id,
        name: data.name,
        price: data.price,
        image: data.image,
        gender: data.gender,
        sizes: data.sizes || {},
        subTshirt: data.subTshirt,
        subJeans: data.subJeans,
        subJackets: data.subJackets,
        subSweatshirts: data.subSweatshirts
      })
    })
    
    const searchTerm = queryText.toLowerCase().trim()
    
    searchResults.value = allProducts.filter(product => {
      const name = (product.name || '').toLowerCase()
      const subCategories = [
        product.subTshirt,
        product.subJeans,
        product.subJackets,
        product.subSweatshirts
      ].filter(Boolean).join(' ').toLowerCase()
      
      return name.includes(searchTerm) || subCategories.includes(searchTerm)
    })
  } catch (error) {
    console.error('Arama sırasında hata:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async (query: string): Promise<void> => {
  console.log('Arama başlatılıyor:', query)
  searchQuery.value = query
  await searchProducts(query)
  console.log('Arama tamamlandı, sonuçlar:', searchResults.value)
}

const handleCloseSearch = (): void => {
  searchQuery.value = ''
  searchResults.value = []
}

const unsubscribeStockUpdates = ref<(() => void) | null>(null)

const setupStockListener = (products: Product[]): void => {
  if (unsubscribeStockUpdates.value) {
    unsubscribeStockUpdates.value()
  }

  const productsRef = collection($db as Firestore, 'products')
  const listeners = products.map(product => {
    return onSnapshot(doc(productsRef, product.firestoreId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedProduct = docSnapshot.data() as Product
        const index = searchResults.value.findIndex(p => p.id === product.id)
        if (index !== -1) {
          searchResults.value[index].sizes = updatedProduct.sizes || {}
        }
      }
    })
  })

  unsubscribeStockUpdates.value = () => {
    listeners.forEach(unsubscribe => unsubscribe())
  }
}

watch(searchResults, (newResults) => {
  if (newResults.length > 0) {
    setupStockListener(newResults)
  }
}, { deep: true })

onUnmounted(() => {
  if (unsubscribeStockUpdates.value) {
    unsubscribeStockUpdates.value()
  }
})

type ErrorType = Error | unknown

const handleAddToCart = async (product: Product): Promise<void> => {
  if (!selectedSizes.value[product.id]) {
    alert('Lütfen bir beden seçin!')
    return
  }

  try {
    const userId = loggedInUser.value?.id || '1'
    const productWithSize = {
      ...product,
      id: product.id,
      selectedSize: selectedSizes.value[product.id],
      userId,
      productId: product.id,
      size: selectedSizes.value[product.id],
      totalPrice: product.price,
      quantity: 1
    } as unknown as CartItem
    
    await cartStore.addToCart($db as Firestore, userId, productWithSize)
    selectedSizes.value[product.id] = ''
    alert('Ürün sepete eklendi!')
  } catch (err: ErrorType) {
    console.error('Sepete ekleme hatası:', err)
    alert(err instanceof Error ? err.message : 'Ürün sepete eklenirken bir hata oluştu.')
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

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      handleSearch(newQuery)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.search-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

.search-wrapper {
  position: relative;
  height: 60px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-content {
  padding-top: 20px;
  width: 100%;
}

.search-results {
  width: 100%;
  margin-top: 20px;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  max-width: 200px;
}

.search-title {
  font-size: 24px;
  margin: 20px 0;
  color: #333;
  text-align: center;
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.size-selector {
  margin-bottom: 10px;
}

.size-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #333;
}

.price {
  font-weight: bold;
  margin: 5px 0;
}

.gender {
  color: #666;
  font-size: 14px;
}

/* Mobil Tasarım */
@media screen and (max-width: 768px) {
  .search-page {
    padding: 10px;
  }

  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .product-card {
    border-radius: 6px;
  }

  .product-image {
    height: 250px;
  }

  .product-info {
    padding: 10px;
  }

  .product-info h3 {
    font-size: 14px;
  }

  .add-to-cart-btn {
    padding: 8px;
    font-size: 14px;
  }
}

/* Küçük Mobil Cihazlar */
@media screen and (max-width: 480px) {
  .results-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 200px;
  }

  .product-info h3 {
    font-size: 12px;
  }

  .price {
    font-size: 14px;
  }

  .gender {
    font-size: 12px;
  }
}
</style> 