<template>
   <div>
      <div class="products-container">
        <div v-if="products.length === 0" class="no-products-message">
          Bu kategoride bir ürün bulunamamıştır.
        </div>
        <div v-else v-for="product in products" :key="product.id" class="product-card">
          <img 
            :src="hoveredProduct === product.id ? product.hoverImage : product.image" 
            :alt="product.name" 
            @mouseover="hoveredProduct = product.id" 
            @mouseleave="hoveredProduct = null" 
            class="product-image" 
          />
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
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
            <p class="product-price">{{ product.price }} TL</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { useNuxtApp } from '#app'
import type { Firestore } from 'firebase/firestore'

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  sizes: Record<string, number>;
  [key: string]: any;
}

interface Props {
  products: Product[];
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const authStore = useAuthStore()
const { loggedInUser } = storeToRefs(authStore)

const hoveredProduct = ref<string | null>(null)
const selectedSizes = ref<Record<string, string>>({})

const handleAddToCart = async (product: Product) => {
  try {
    const selectedSize = selectedSizes.value[product.id]
    if (!selectedSize) {
      alert('Lütfen bir beden seçin!')
      return
    }

    const { $db } = useNuxtApp()
    const userId = loggedInUser.value?.id || '1'
    
    // Ürün verilerini doğru formatta hazırla
    const productWithSize = {
      ...product,
      selectedSize: selectedSize
    }

    // Cart store'daki addToCart metodunu kullan
    await cartStore.addToCart($db as Firestore, userId, productWithSize)
    
    // Başarılı ekleme sonrası seçili bedeni sıfırla
    selectedSizes.value[product.id] = ''
    alert('Ürün sepete eklendi!')
  } catch (error) {
    console.error('Sepete eklenirken hata:', error)
    if (error instanceof Error && error.message === 'Bu ürünün stoğu tükenmiştir') {
      alert('Bu ürünün stoğu tükenmiştir!')
    } else {
      alert(error instanceof Error ? error.message : 'Ürün sepete eklenirken bir hata oluştu!')
    }
  }
}
</script>

<style scoped>
.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  background-color: white;
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
}

.product-info {
  margin-top: 10px;
}

.product-name {
  font-size: 1.1em;
  margin: 5px 0;
}

.product-price {
  font-weight: bold;
  color: #333;
}

.size-selector {
  margin: 10px 0;
}

.size-select {
  padding: 5px;
  width: 100%;
  margin-bottom: 10px;
}

.add-to-cart-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  width: 100%;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-products-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}
</style>
  