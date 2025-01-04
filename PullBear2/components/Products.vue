<template>
   <div>
      <!-- Ürünler -->
      <div class="products-container">
        <!-- Eğer filtrelenmiş ürün yoksa mesaj göster -->
        <div v-if="filteredProducts.length === 0" class="no-products-message">
          Bu kategoride bir ürün bulunamamıştır.
        </div>
        <!-- Ürünler varsa onları göster -->
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
            <button class="add-to-cart-btn">Sepete Ekle</button>
            <p class="product-price">{{ product.price }} TL</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore'
import { useNuxtApp } from 'nuxt/app'

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
            hoveredProduct: null,
            products: [],
        };
    },
    async created() {
        await this.fetchProducts();
    },
    methods: {
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
        }
    },
    computed: {
        filteredProducts() {
            // Önce cinsiyete göre filtrele
            let filtered = this.products;
        
        // Eğer gender 'all' değilse, cinsiyete göre filtrele
        if (this.defaultGender !== 'all') {
            filtered = filtered.filter(product => product.gender === this.defaultGender);
        }
            
            // Kategori filtreleme
            if (this.defaultCategory !== 'all') {
                filtered = filtered.filter(product => product.category === this.defaultCategory);
            }
            // SubTshirt filtresini sadece tshirts kategorisi için uygula
        if (this.defaultSubTshirt !== 'all' && this.defaultCategory === 'tshirts') {
            filtered = filtered.filter(product => 
                product.subTshirt && product.subTshirt.includes(this.defaultSubTshirt)
            );
        }
        if (this.defaultSubJeans !== 'all' && this.defaultCategory === 'jeans') {
            filtered = filtered.filter(product => 
                product.subJeans && product.subJeans.includes(this.defaultSubJeans)
            );
        }
        if (this.defaultSubJackets !== 'all' && this.defaultCategory === 'jackets') {
            filtered = filtered.filter(product => 
                product.subJackets && product.subJackets.includes(this.defaultSubJackets)
            );
        }
        if (this.defaultSubSweatshirts !== 'all' && this.defaultCategory === 'sweatshirts') {
            filtered = filtered.filter(product => 
                product.subSweatshirts && product.subSweatshirts.includes(this.defaultSubSweatshirts)
            );
        }
        
        
            return filtered;
        }
    }
};
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
  </style>
  