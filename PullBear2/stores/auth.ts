import { defineStore } from 'pinia'
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore'

export interface User {
  id: string
  name: string
  surname: string
  email: string
}

export interface Order {
  id: string
  orderDate: Date
  items: OrderItem[]
  totalAmount: number
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  totalPrice: number
  image: string
  isReturned?: boolean
}

interface AuthState {
  loggedInUser: User | null
  userOrders: any[]
  userReturns: any[]
  contactInfo: {
    email: string
    phone: string
    workingHours: string
    address: string
  }
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedInUser: null as User | null,
    userOrders: [] as any[],
    userReturns: [] as any[],
    contactInfo: null as any,
    loading: false
  }),

  actions: {
    setUser(user: User | null) {
      this.loggedInUser = user
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('loggedInUser')
      }
    },

    checkAuth() {
      const savedUser = localStorage.getItem('loggedInUser')
      if (savedUser) {
        this.loggedInUser = JSON.parse(savedUser)
      }
    },

    logout() {
      this.loggedInUser = null
      localStorage.removeItem('loggedInUser')
    },

    async loadUserOrders(db: any) {
      if (!this.loggedInUser) return

      try {
        const ordersRef = collection(db, 'orders')
        const q = query(ordersRef, where('userId', '==', this.loggedInUser.id))
        const querySnapshot = await getDocs(q)
        
        this.userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate.toDate()
        }))

        this.userOrders.sort((a, b) => b.orderDate - a.orderDate)
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error)
      }
    },

    async loadUserReturns(db: any) {
      if (!this.loggedInUser) return

      try {
        const returnsRef = collection(db, 'returns')
        const q = query(returnsRef, where('userId', '==', this.loggedInUser.id))
        const querySnapshot = await getDocs(q)
        
        const returnsByOrder: { [key: string]: any[] } = {}
        querySnapshot.docs.forEach(doc => {
          const data = doc.data()
          const orderId = data.orderId
          
          if (!returnsByOrder[orderId]) {
            returnsByOrder[orderId] = []
          }

          const returnDate = data.returnDate?.toDate?.() || new Date(data.returnDate)
          const orderDate = data.orderDate?.toDate?.() || returnDate

          returnsByOrder[orderId].push({
            id: doc.id,
            ...data,
            returnDate,
            orderDate
          })
        })

        this.userReturns = Object.entries(returnsByOrder).map(([orderId, returns]) => {
          const allItems = returns.reduce((acc, return_) => {
            return_.items.forEach((item: any) => {
              const existingItem = acc.find((i: any) => 
                i.productId === item.productId && 
                i.size === item.size
              )
              if (!existingItem) {
                acc.push({...item})
              }
            })
            return acc
          }, [])

          const latestReturn = returns.reduce((latest, current) => 
            latest.returnDate > current.returnDate ? latest : current
          )

          return {
            id: latestReturn.id,
            orderId: orderId,
            userId: latestReturn.userId,
            items: allItems,
            totalAmount: allItems.reduce((total: number, item: any) => total + item.totalPrice, 0),
            returnDate: latestReturn.returnDate,
            orderDate: latestReturn.orderDate,
            isFullReturn: this.isOrderFullyReturned(orderId)
          }
        })

        this.userReturns.sort((a, b) => b.returnDate.getTime() - a.returnDate.getTime())
      } catch (error) {
        console.error('İadeler yüklenirken hata:', error)
      }
    },

    async loadCustomerServices(db: any) {
      try {
        this.loading = true
        const customerServicesRef = collection(db, 'customer-services')
        const querySnapshot = await getDocs(customerServicesRef)
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data()
          this.contactInfo = {
            email: data.email || '',
            phone: data.phone || '',
            workingHours: data.workingHours || '',
            address: data.address || ''
          }
        }
      } catch (error) {
        console.error('Müşteri hizmetleri bilgileri yüklenirken hata:', error)
      } finally {
        this.loading = false
      }
    },

    isOrderFullyReturned(orderId: string): boolean {
      const order = this.userOrders.find(order => order.id === orderId)
      if (!order) return false
      return order.items.every((item: any) => item.isReturned === true)
    },

    canReturn(orderDate: Date): boolean {
      const now = new Date()
      const orderDateTime = new Date(orderDate)
      const timeDifference = now.getTime() - orderDateTime.getTime()
      const oneMinuteInMs = 60 * 1000
      return timeDifference <= oneMinuteInMs
    },

    async returnOrderItem(db: any, order: any, item: any) {
      try {
        // Önce ürünün stok durumunu güncelle
        const productRef = doc(db, 'products', item.productId)
        const productDoc = await getDoc(productRef)
        
        if (productDoc.exists()) {
          const currentSizes = productDoc.data().sizes
          await updateDoc(productRef, {
            [`sizes.${item.size}`]: currentSizes[item.size] + item.quantity
          })
        }

        // İade kaydı oluştur
        const returnData = {
          userId: this.loggedInUser?.id,
          orderId: order.id,
          returnDate: new Date(),
          items: [{
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            totalPrice: item.totalPrice,
            image: item.image
          }],
          totalAmount: item.totalPrice
        }

        await addDoc(collection(db, 'returns'), returnData)

        // Sipariş içindeki ürünü iade edildi olarak işaretle
        const orderRef = doc(db, 'orders', order.id)
        const orderDoc = await getDoc(orderRef)
        
        if (orderDoc.exists()) {
          const updatedItems = orderDoc.data().items.map((orderItem: any) => {
            if (orderItem.productId === item.productId && orderItem.size === item.size) {
              return { ...orderItem, isReturned: true }
            }
            return orderItem
          })

          await updateDoc(orderRef, { items: updatedItems })
        }

        // Kullanıcının sipariş ve iade listelerini güncelle
        await this.loadUserOrders(db)
        await this.loadUserReturns(db)
      } catch (error) {
        console.error('Return order item error:', error)
        throw error
      }
    },

    async returnEntireOrder(db: any, order: any) {
      try {
        // Her bir ürün için stok güncelle
        for (const item of order.items) {
          if (!item.isReturned) {
            const productRef = doc(db, 'products', item.productId)
            const productDoc = await getDoc(productRef)
            
            if (productDoc.exists()) {
              const currentSizes = productDoc.data().sizes
              await updateDoc(productRef, {
                [`sizes.${item.size}`]: currentSizes[item.size] + item.quantity
              })
            }
          }
        }

        // İade edilmemiş ürünleri filtrele
        const nonReturnedItems = order.items.filter((item: any) => !item.isReturned)

        if (nonReturnedItems.length > 0) {
          // İade kaydı oluştur
          const returnData = {
            userId: this.loggedInUser?.id,
            orderId: order.id,
            returnDate: new Date(),
            items: nonReturnedItems.map((item: any) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              totalPrice: item.totalPrice,
              image: item.image
            })),
            totalAmount: nonReturnedItems.reduce((total: number, item: any) => total + item.totalPrice, 0)
          }

          await addDoc(collection(db, 'returns'), returnData)

          // Tüm ürünleri iade edildi olarak işaretle
          const orderRef = doc(db, 'orders', order.id)
          const updatedItems = order.items.map((item: any) => ({ ...item, isReturned: true }))
          await updateDoc(orderRef, { items: updatedItems })

          // Kullanıcının sipariş ve iade listelerini güncelle
          await this.loadUserOrders(db)
          await this.loadUserReturns(db)
        }
      } catch (error) {
        console.error('Return entire order error:', error)
        throw error
      }
    },

    async loginUser(db: any, user: any) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id))
        if (userDoc.exists()) {
          const userData = { 
            id: userDoc.id, 
            name: userDoc.data().name,
            surname: userDoc.data().surname,
            email: userDoc.data().email
          } as User
          this.setUser(userData)
          alert(`Giriş başarılı! Hoşgeldiniz, ${userData.name} ${userData.surname}`)
          return userData
        } else {
          throw new Error('Kullanıcı bulunamadı!')
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async logoutUser() {
      try {
        this.logout()
        alert('Çıkış yapıldı!')
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },

    async registerUser(db: any, userData: any) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userData.id))
        if (userDoc.exists()) {
          const user = { 
            id: userDoc.id,
            name: userDoc.data().name,
            surname: userDoc.data().surname,
            email: userDoc.data().email
          } as User
          this.setUser(user)
          return user
        } else {
          throw new Error('Kullanıcı kaydı bulunamadı!')
        }
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    }
  }
})