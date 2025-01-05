<template>
   <div>
      <div class="products-container">
        <div v-if="filteredProducts.length === 0" class="no-products-message">
          Bu kategoride bir ürün bulunamamıştır.
        </div>
        <div v-else v-for="product in filteredProducts" :key="product.id" class="product-card">
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

<script>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore'

export default {
    props: {
        gender: {
            type: String,
            required: true
        },
        defaultCategory: {
            type: String,
            required: true
        },
        defaultGender: {
            type: String,
            required: true
        },
        defaultSubTshirt: {
            type: String,
            required: true
        },
        defaultSubJeans: {
            type: String,
            required: true
        },
        defaultSubJackets: {
            type: String,
            required: true
        },
        defaultSubSweatshirts: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            products: [],
            hoveredProduct: null,
            loggedInUser: null,
            authCheckInterval: null,
            selectedSizes: {}
        }
    },
    watch: {
        // Kullanıcı durumunu izle
        loggedInUser: {
            handler(newUser) {
                // Kullanıcı değiştiğinde sepeti güncelle
                this.checkAndUpdateCart();
            },
            deep: true
        }
    },
    methods: {
        async checkAndUpdateCart() {
            try {
                const { $db } = useNuxtApp();
                const cartRef = collection($db, 'cart');
                
                // Eski kullanıcının (userId = '1') sepetindeki ürünleri al
                const oldCartQuery = query(cartRef, where('userId', '==', '1'));
                const oldCartSnapshot = await getDocs(oldCartQuery);
                
                // Eğer eski sepette ürün varsa ve kullanıcı giriş yapmışsa
                if (!oldCartSnapshot.empty && this.loggedInUser) {
                    // Önce eski ürünleri grupla (aynı ürünleri birleştir)
                    const groupedOldItems = {};
                    oldCartSnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        const productId = data.productId;
                        if (!groupedOldItems[productId]) {
                            groupedOldItems[productId] = {
                                ...data,
                                docs: []
                            };
                        }
                        groupedOldItems[productId].docs.push(doc);
                    });

                    // Her bir gruplanmış ürün için işlem yap
                    for (const productId in groupedOldItems) {
                        const oldItemData = groupedOldItems[productId];
                        
                        // Yeni kullanıcının sepetinde aynı üründen var mı kontrol et
                        const existingItemQuery = query(cartRef,
                            where('userId', '==', this.loggedInUser.id),
                            where('productId', '==', productId)
                        );
                        const existingItemSnapshot = await getDocs(existingItemQuery);
                        
                        // Eski ürünleri sil
                        for (const oldDoc of oldItemData.docs) {
                            await deleteDoc(oldDoc.ref);
                        }

                        // Yeni kullanıcının sepetine ekle
                        await addDoc(cartRef, {
                            ...oldItemData,
                            userId: this.loggedInUser.id,
                            docs: undefined // docs alanını kaldır
                        });
                    }
                }
            } catch (error) {
                console.error('Sepet güncelleme hatası:', error);
            }
        },
        checkAuthStatus() {
            const savedUser = localStorage.getItem('loggedInUser');
            if (!savedUser && this.loggedInUser) {
                // Kullanıcı çıkış yapmış
                this.loggedInUser = null;
            } else if (savedUser && !this.loggedInUser) {
                // Kullanıcı giriş yapmış
                this.loggedInUser = JSON.parse(savedUser);
            }
        },
        async fetchProducts() {
            try {
                const { $db } = useNuxtApp();
                const querySnapshot = await getDocs(collection($db, "products"));
                this.products = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        async handleAddToCart(product) {
            try {
                const selectedSize = this.selectedSizes[product.id];
                if (!selectedSize) {
                    alert('Lütfen bir beden seçin!');
                    return;
                }

                if (product.sizes[selectedSize] === 0) {
                    alert('Seçilen beden tükendi!');
                    return;
                }

                const { $db } = useNuxtApp();
                const cartRef = collection($db, 'cart');
                
                // Kullanıcı durumunu kontrol et
                this.checkAuthStatus();
                
                // Kullanıcı ID'sini belirle
                const userId = this.loggedInUser ? this.loggedInUser.id : '1';
                
                // Önce ürünün kullanıcının sepetinde olup olmadığını kontrol et
                const q = query(cartRef, 
                    where('productId', '==', product.id),
                    where('userId', '==', userId),
                    where('size', '==', selectedSize)
                );
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    // Ürün zaten sepette, miktarını artır
                    const existingItem = querySnapshot.docs[0];
                    const currentQuantity = existingItem.data().quantity || 1;
                    
                    // Stok kontrolü
                    if (product.sizes[selectedSize] === 0) {
                        alert('Bu bedende ürün tükendi!');
                        return;
                    }
                    
                    await updateDoc(doc($db, 'cart', existingItem.id), {
                        quantity: currentQuantity + 1,
                        totalPrice: (currentQuantity + 1) * product.price
                    });
                } else {
                    // Yeni ürün ekle
                    await addDoc(cartRef, {
                        userId: userId,
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        totalPrice: product.price,
                        quantity: 1,
                        image: product.image,
                        size: selectedSize
                    });
                }
                
                // Stok durumunu güncelle
                const productRef = doc($db, 'products', product.id);
                await updateDoc(productRef, {
                    [`sizes.${selectedSize}`]: 0 // Ürün sepete eklendiğinde stok tükenir
                });
                
                // Ürünü yeniden yükle
                await this.fetchProducts();
                
                alert('Ürün sepete eklendi!');
            } catch (error) {
                console.error('Sepete eklenirken hata:', error);
                alert('Ürün sepete eklenirken bir hata oluştu!');
            }
        }
    },
    mounted() {
        this.fetchProducts();
        // LocalStorage'dan kullanıcı bilgisini al
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            this.loggedInUser = JSON.parse(savedUser);
        }
        
        // Her 1 saniyede bir kullanıcı durumunu kontrol et
        this.authCheckInterval = setInterval(() => {
            this.checkAuthStatus();
        }, 1000);
    },
    beforeUnmount() {
        // Interval'i temizle
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
        }
    },
    computed: {
        filteredProducts() {
            let filtered = this.products
        
        if (this.defaultGender !== 'all') {
                filtered = filtered.filter(product => product.gender === this.defaultGender)
        }
            
            if (this.defaultCategory !== 'all') {
                filtered = filtered.filter(product => product.category === this.defaultCategory)
            }

        if (this.defaultSubTshirt !== 'all' && this.defaultCategory === 'tshirts') {
            filtered = filtered.filter(product => 
                product.subTshirt && product.subTshirt.includes(this.defaultSubTshirt)
                )
        }

        if (this.defaultSubJeans !== 'all' && this.defaultCategory === 'jeans') {
            filtered = filtered.filter(product => 
                product.subJeans && product.subJeans.includes(this.defaultSubJeans)
                )
        }

        if (this.defaultSubJackets !== 'all' && this.defaultCategory === 'jackets') {
            filtered = filtered.filter(product => 
                product.subJackets && product.subJackets.includes(this.defaultSubJackets)
                )
        }

        if (this.defaultSubSweatshirts !== 'all' && this.defaultCategory === 'sweatshirts') {
            filtered = filtered.filter(product => 
                product.subSweatshirts && product.subSweatshirts.includes(this.defaultSubSweatshirts)
                )
        }
        
            return filtered
        }
    }
}
</script>

<style scoped>
.products-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  justify-content: center;
  align-items: center;
}
.no-products-message {
  width: 100%;
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 20px 0;
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.product-item {
  text-align: center;
}
  
  .product-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
  }
  
  .product-image {
  width: 343px;
  height: 485px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: transform 0.3s ease;
}
.product-image:hover {
  transform: scale(1.05); /* Hover sırasında hafif büyütme efekti */
}
  

  
  .product-name {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bolder;
}

.product-price {
  margin-top: 5px;
  font-size: 15px;
  font-weight: bold;
  color: #555;
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
}

.add-to-cart-btn:hover {
  background-color: #333;
}

@keyframes cartButtonAnimation {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.cart-button-animate {
    animation: cartButtonAnimation 0.5s ease;
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

.add-to-cart-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
  