import { defineStore } from 'pinia'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Firestore } from 'firebase/firestore'
import { useProductStore } from './products'

export interface CartItem {
  id: string
  userId: string
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  totalPrice: number
  image: string
}

interface CartState {
  cartItems: CartItem[]
  isCartOpen: boolean
  loading: boolean
  error: string | null
  unsubscribe: (() => void) | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cartItems: [],
    isCartOpen: false,
    loading: false,
    error: null,
    unsubscribe: null
  }),

  getters: {
    totalItems: (state) => state.cartItems.length,
    totalAmount: (state) => state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
  },

  actions: {
    setCartItems(items: CartItem[]): void {
      this.cartItems = items
    },

    toggleCart(value?: boolean): void {
      this.isCartOpen = value !== undefined ? value : !this.isCartOpen
    },

    resetCart(): void {
      this.cartItems = []
      this.isCartOpen = false
    },

    async setupCartListener(db: Firestore, userId: string) {
      try {
        // Önceki listener varsa kaldır
        if (this.unsubscribe) {
          this.unsubscribe()
        }

        const cartRef = collection(db, 'cart')
        const q = query(cartRef, where('userId', '==', userId))

        this.unsubscribe = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as CartItem[]
          this.setCartItems(items)
        }, (error) => {
          console.error('Sepet dinlenirken hata:', error)
          this.error = error.message
        })
      } catch (error) {
        console.error('Sepet listener kurulum hatası:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
      }
    },

    async checkAndUpdateCart(db: Firestore, userId: string) {
      this.loading = true
      try {
        const cartRef = collection(db, 'cart')
        const oldCartQuery = query(cartRef, where('userId', '==', '1'))
        const oldCartSnapshot = await getDocs(oldCartQuery)
        
        if (!oldCartSnapshot.empty) {
          const updatePromises = oldCartSnapshot.docs.map(async (doc) => {
            const itemData = doc.data()
            await deleteDoc(doc.ref)
            await addDoc(cartRef, {
              ...itemData,
              userId: userId
            })
          })
          
          await Promise.all(updatePromises)
        }
      } catch (error) {
        console.error('Sepet güncelleme hatası:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    async increaseQuantity(db: Firestore, item: CartItem) {
      this.loading = true
      try {
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where('id', '==', Number(item.productId)))
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
          throw new Error('Ürün bulunamadı')
        }

        const productDoc = querySnapshot.docs[0]
        const currentSizes = productDoc.data().sizes

        if (currentSizes[item.size] === 0) {
          throw new Error('Bu ürünün stoğu tükenmiştir')
        }

        // Sepetteki miktarı artır
        await updateDoc(doc(db, 'cart', item.id), {
          quantity: item.quantity + 1,
          totalPrice: (item.quantity + 1) * item.price
        })

        // Ürün stoğunu güncelle
        await updateDoc(doc(db, 'products', productDoc.id), {
          [`sizes.${item.size}`]: currentSizes[item.size] - 1
        })
      } catch (error) {
        console.error('Miktar artırılırken hata:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async decreaseQuantity(db: Firestore, item: CartItem) {
      if (item.quantity <= 1) return

      this.loading = true
      try {
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where('id', '==', Number(item.productId)))
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0]
          const currentSizes = productDoc.data().sizes

          await updateDoc(doc(db, 'products', productDoc.id), {
            [`sizes.${item.size}`]: currentSizes[item.size] + 1
          })
        }

        await updateDoc(doc(db, 'cart', item.id), {
          quantity: item.quantity - 1,
          totalPrice: (item.quantity - 1) * item.price
        })
      } catch (error) {
        console.error('Miktar azaltılırken hata:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    async removeFromCart(db: Firestore, item: CartItem) {
      this.loading = true
      try {
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where('id', '==', Number(item.productId)))
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0]
          const currentSizes = productDoc.data().sizes
          
          // Stok miktarını geri yükle
          await updateDoc(doc(db, 'products', productDoc.id), {
            [`sizes.${item.size}`]: currentSizes[item.size] + item.quantity
          })
        }
        
        await deleteDoc(doc(db, 'cart', item.id))
      } catch (error) {
        console.error('Ürün sepetten kaldırılırken hata:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    async clearCart(db: Firestore, userId: string) {
      this.loading = true
      try {
        const cartRef = collection(db, 'cart')
        const q = query(cartRef, where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        
        for (const cartDoc of querySnapshot.docs) {
          const item = cartDoc.data() as CartItem
          
          // Ürün stoğunu güncelle
          const productsRef = collection(db, 'products')
          const productQuery = query(productsRef, where('id', '==', Number(item.productId)))
          const productSnapshot = await getDocs(productQuery)
          
          if (!productSnapshot.empty) {
            const productDoc = productSnapshot.docs[0]
            const currentSizes = productDoc.data().sizes
            
            // Stok miktarını geri yükle
            await updateDoc(doc(db, 'products', productDoc.id), {
              [`sizes.${item.size}`]: currentSizes[item.size] + item.quantity
            })
          }
          
          // Ürünü sepetten kaldır
          await deleteDoc(cartDoc.ref)
        }

        // Sepeti sıfırla
        this.resetCart()
      } catch (error) {
        console.error('Sepet temizlenirken hata:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    async placeOrder(db: Firestore, userId: string) {
      this.loading = true
      try {
        const order = {
          userId: userId,
          items: this.cartItems.map(item => ({
            productId: String(item.productId),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.size,
            totalPrice: item.totalPrice
          })),
          totalAmount: this.totalAmount,
          orderDate: new Date(),
          status: 'completed'
        }

        await addDoc(collection(db, 'orders'), order)

        // Sepeti temizle ama stokları geri yükleme
        const cartRef = collection(db, 'cart')
        const q = query(cartRef, where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        
        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref)
        }

        this.resetCart()
        return true
      } catch (error) {
        console.error('Sipariş oluşturulurken hata:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
        return false
      } finally {
        this.loading = false
      }
    },

    async addToCart(db: Firestore, userId: string, product: any) {
      this.loading = true
      try {
        // Önce ürünün stok durumunu kontrol et
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where('id', '==', Number(product.id)))
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
          throw new Error('Ürün bulunamadı')
        }

        const productDoc = querySnapshot.docs[0]
        const currentSizes = productDoc.data().sizes
        
        if (currentSizes[product.selectedSize] <= 0) {
          throw new Error('Bu ürünün stoğu tükenmiştir')
        }

        // Sepete eklenecek ürün
        const cartItem = {
          userId,
          productId: Number(product.id),
          name: product.name,
          price: product.price,
          quantity: 1,
          size: product.selectedSize,
          totalPrice: product.price,
          image: product.image
        }

        // Sepette aynı ürün ve beden var mı kontrol et
        const cartRef = collection(db, 'cart')
        const cartQuery = query(
          cartRef,
          where('userId', '==', userId),
          where('productId', '==', Number(product.id)),
          where('size', '==', product.selectedSize)
        )
        const cartSnapshot = await getDocs(cartQuery)

        if (cartSnapshot.empty) {
          // Yeni ürün ekle
          await addDoc(cartRef, cartItem)
        } else {
          // Mevcut ürünün miktarını artır
          const existingItem = cartSnapshot.docs[0]
          const newQuantity = existingItem.data().quantity + 1
          const newTotalPrice = existingItem.data().price * newQuantity
          
          await updateDoc(doc(db, 'cart', existingItem.id), {
            quantity: newQuantity,
            totalPrice: newTotalPrice
          })
        }

        // Ürün stoğunu güncelle
        await updateDoc(doc(db, 'products', productDoc.id), {
          [`sizes.${product.selectedSize}`]: currentSizes[product.selectedSize] - 1
        })

      } catch (error) {
        console.error('Ürün sepete eklenirken hata:', error)
        if (error instanceof Error) {
          this.error = error.message
        }
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 