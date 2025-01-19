import { defineStore } from 'pinia'
import { collection, query, where, getDocs, onSnapshot, updateDoc, doc, Firestore } from 'firebase/firestore'

export interface Product {
  id: string
  firestoreId: string
  gender: string
  category: string
  name: string
  price: number
  image: string
  hoverImage: string
  sizes: Record<string, number>
  [key: string]: any
}

interface ProductState {
  products: Product[]
  selectedCategory: string
  selectedGender: string
  selectedSubCategory: string
  loading: boolean
  error: string | null
}

// Alt kategori alan adları için mapping
const subCategoryFields: Record<string, string> = {
  'tshirts': 'subTshirt',
  'jeans': 'subJeans',
  'jackets': 'subJackets',
  'sweatshirts': 'subSweatshirts'
}

export const useProductStore = defineStore('products', {
  state: (): ProductState => ({
    products: [],
    selectedCategory: 'all',
    selectedGender: 'all',
    selectedSubCategory: 'all',
    loading: false,
    error: null
  }),

  getters: {
    filteredProducts: (state: ProductState): Product[] => {
      let filtered = state.products

      if (state.selectedGender !== 'all') {
        filtered = filtered.filter(product => product.gender === state.selectedGender)
      }
      
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === state.selectedCategory)
      }

      if (state.selectedSubCategory !== 'all') {
        filtered = filtered.filter(product => {
          const subCategoryField = subCategoryFields[state.selectedCategory]
          const subCategory = product[subCategoryField]

          if (!subCategory) return false

          if (Array.isArray(subCategory)) {
            return subCategory.some(sub => sub.toString() === state.selectedSubCategory.toString())
          }
          
          return subCategory.toString() === state.selectedSubCategory.toString()
        })
      }

      return filtered
    }
  },

  actions: {
    setProducts(products: Product[]): void {
      this.products = products
    },

    setFilters(category: string, gender: string, subCategory: string): void {
      this.selectedCategory = category
      this.selectedGender = gender
      this.selectedSubCategory = subCategory
    },

    async searchProducts(searchTerm: string): Promise<Product[]> {
      try {
        if (!searchTerm.trim()) {
          return []
        }
        
        const searchTermLower = searchTerm.toLowerCase()
        return this.products.filter(product => 
          product.name.toLowerCase().includes(searchTermLower) ||
          product.category.toLowerCase().includes(searchTermLower) ||
          product.gender.toLowerCase().includes(searchTermLower)
        )
      } catch (error: unknown) {
        console.error('Search products error:', error instanceof Error ? error.message : 'Unknown error')
        return []
      }
    },

    async fetchProducts(db: Firestore) {
      this.loading = true
      this.error = null
      try {
        const productsRef = collection(db, 'products')
        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
          const products = snapshot.docs.map(doc => ({
            ...doc.data(),
            firestoreId: doc.id,
            id: doc.data().id
          })) as Product[]
          this.setProducts(products)
        }, (error: Error) => {
          console.error("Ürün dinleme hatası:", error)
          this.error = error.message
        })
        return unsubscribe
      } catch (error) {
        if (error instanceof Error) {
          console.error("Ürün yükleme hatası:", error)
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    async updateProductStock(db: Firestore, productId: string, size: string): Promise<void> {
      try {
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where('id', '==', productId))
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0]
          const currentSizes = productDoc.data().sizes
          
          await updateDoc(doc(db, 'products', productDoc.id), {
            [`sizes.${size}`]: currentSizes[size] - 1
          })
        }
      } catch (error) {
        console.error('Stok güncelleme hatası:', error)
        throw error
      }
    }
  }
}) 