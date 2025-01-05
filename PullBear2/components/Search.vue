<template>
  <div class="search-section">
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Ara"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>

    <!-- Arama Sonuçları -->
    <div v-if="showResults" class="search-results">
      <div v-if="loading" class="loading">
        Aranıyor...
      </div>

      <div v-else-if="searchResults.length === 0" class="no-results">
        "{{ searchQuery }}" için sonuç bulunamadı.
      </div>

      <div v-else class="results-grid">
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

      <button v-if="showResults" class="close-button" @click="closeResults">
        ✕
      </button>
    </div>
  </div>
</template>

<script>
import { useNuxtApp } from '#app'
import { collection, query, getDocs, addDoc, updateDoc, doc, where, getDoc, deleteDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      loading: false,
      showResults: false,
      selectedSizes: {},
      loggedInUser: null,
      authCheckInterval: null
    }
  },
  methods: {
    checkAuthStatus() {
      const savedUser = localStorage.getItem('loggedInUser')
      if (!savedUser && this.loggedInUser) {
        this.loggedInUser = null
      } else if (savedUser && !this.loggedInUser) {
        this.loggedInUser = JSON.parse(savedUser)
      }
    },
    async handleSearch() {
      if (!this.searchQuery.trim()) return

      // En az 3 harf kontrolü
      if (this.searchQuery.trim().length < 3) {
        alert('Aramak için en az 3 harf giriniz.')
        return
      }

      this.loading = true
      this.showResults = true
      this.searchResults = []
      this.selectedSizes = {}

      try {
        const { $db } = useNuxtApp()
        if (!$db) {
          console.error('Firestore bağlantısı bulunamadı')
          return
        }

        const productsRef = collection($db, 'products')
        const productsQuery = query(productsRef)
        const productsSnapshot = await getDocs(productsQuery)

        const searchTerm = this.searchQuery.toLowerCase().trim()
        
        const searchInProduct = (product) => {
          const name = (product.name || '').toLowerCase()
          const subCategories = [
            product.subTshirt,
            product.subJeans,
            product.subJackets,
            product.subSweatshirts
          ].filter(Boolean).join(' ').toLowerCase()
          
          return name.includes(searchTerm) || subCategories.includes(searchTerm)
        }

        const allProducts = []
        productsSnapshot.forEach(doc => {
          const data = doc.data()
          const product = { 
            firestoreId: doc.id,
            id: data.id,
            ...data 
          }
          if (searchInProduct(product)) {
            allProducts.push(product)
          }
        })

        console.log('Arama sonuçları:', allProducts)
        this.searchResults = allProducts

      } catch (error) {
        console.error('Arama sırasında hata:', error)
      } finally {
        this.loading = false
      }
    },
    async handleAddToCart(product) {
      try {
        const selectedSize = this.selectedSizes[product.id]
        if (!selectedSize) {
          alert('Lütfen bir beden seçin!')
          return
        }

        if (product.sizes[selectedSize] === 0) {
          alert('Seçilen beden tükendi!')
          return
        }

        const { $db } = useNuxtApp()
        if (!$db) {
          console.error('Firestore bağlantısı bulunamadı ($db undefined)')
          return
        }

        console.log('Sepete eklenecek ürün:', {
          id: product.id,
          productId: product.productId,
          name: product.name,
          size: selectedSize
        })

        const cartRef = collection($db, 'cart')
        
        // Kullanıcı durumunu kontrol et
        this.checkAuthStatus()
        
        // Kullanıcı ID'sini belirle
        const userId = this.loggedInUser ? this.loggedInUser.id : '1'
        
        // Önce ürünün kullanıcının sepetinde olup olmadığını kontrol et
        const q = query(cartRef, 
          where('productId', '==', String(product.id)),
          where('userId', '==', String(userId)),
          where('size', '==', selectedSize)
        )
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          // Ürün zaten sepette, miktarını artır
          const existingItem = querySnapshot.docs[0]
          const currentQuantity = existingItem.data().quantity || 1
          
          // Stok kontrolü
          if (product.sizes[selectedSize] === 0) {
            alert('Bu bedende ürün tükendi!')
            return
          }
          
          await updateDoc(doc($db, 'cart', String(existingItem.id)), {
            quantity: currentQuantity + 1,
            totalPrice: (currentQuantity + 1) * product.price
          })
        } else {
          // Yeni ürün ekle
          await addDoc(cartRef, {
            userId: String(userId),
            productId: String(product.id),
            name: product.name,
            price: product.price,
            totalPrice: product.price,
            quantity: 1,
            image: product.image,
            size: selectedSize
          })
        }
        
        // Debug için ürün ID'sini kontrol edelim
        console.log('Ürün ID tipi:', typeof product.id)
        console.log('Ürün ID değeri:', product.id)
        
        // Stok durumunu güncelle
        const productRef = doc($db, 'products', product.firestoreId)
        
        console.log('Firestore ürün referansı:', productRef.path)
        
        const productDoc = await getDoc(productRef)
        
        if (!productDoc.exists()) {
          console.error('Ürün bulunamadı:', product.id)
          alert('Ürün bulunamadı! Lütfen sayfayı yenileyip tekrar deneyin.')
          return
        }
        
        try {
          await updateDoc(productRef, {
            [`sizes.${selectedSize}`]: 0
          })
          
          // Ürünü yeniden yükle
          await this.handleSearch()
          
          alert('Ürün sepete eklendi!')
        } catch (error) {
          console.error('Stok güncellenirken hata:', error)
          // Sepete ekleme işlemini geri al
          if (!querySnapshot.empty) {
            try {
              await updateDoc(doc($db, 'cart', String(existingItem.id)), {
                quantity: currentQuantity,
                totalPrice: currentQuantity * product.price
              })
            } catch (rollbackError) {
              console.error('Sepet geri alma hatası:', rollbackError)
            }
          } else {
            try {
              await deleteDoc(doc($db, 'cart', String(product.id)))
            } catch (rollbackError) {
              console.error('Sepet silme hatası:', rollbackError)
            }
          }
          alert('Ürün stok durumu güncellenirken bir hata oluştu!')
        }
      } catch (error) {
        console.error('Sepete eklenirken hata:', error)
        alert('Ürün sepete eklenirken bir hata oluştu!')
      }
    },
    closeResults() {
      this.showResults = false
      this.searchQuery = ''
      this.searchResults = []
      this.selectedSizes = {}
    }
  },
  mounted() {
    // LocalStorage'dan kullanıcı bilgisini al
    const savedUser = localStorage.getItem('loggedInUser')
    if (savedUser) {
      this.loggedInUser = JSON.parse(savedUser)
    }
    
    // Her 1 saniyede bir kullanıcı durumunu kontrol et
    this.authCheckInterval = setInterval(() => {
      this.checkAuthStatus()
    }, 1000)
  },
  beforeUnmount() {
    // Interval'i temizle
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval)
    }
  }
}
</script>

<style scoped>
.search-section {
  position: relative;
  z-index: 1000;
}

.search-container {
  display: flex;
  align-items: center;
  position: absolute;
  padding: 5px;
  right: 200px;
  top: -50px;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 50px;
  outline: none;
  width: 100px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  width: 200px;
  border-color: #007bff;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 5px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-button .icon {
  width: 20px;
  height: 20px;
  color: white;
}

.search-button:hover {
  background: #2e2e2e;
}

.search-results {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  z-index: 1001;
  padding: 20px;
  overflow-y: auto;
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
  max-width: 1200px;
  margin: 0 auto;
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
  margin: 0;
  font-size: 16px;
  color: #333;
}

.price {
  font-weight: bold;
  color: #000;
  margin: 10px 0;
}

.gender {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
}

.close-button:hover {
  background: #333;
}

.size-selector {
  margin: 10px 0;
}

.size-select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 150px;
  font-size: 14px;
  background-color: white;
}

.add-to-cart-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 8px 0;
  font-size: 14px;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 150px;
}

.add-to-cart-btn:hover {
  background-color: #333;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
  