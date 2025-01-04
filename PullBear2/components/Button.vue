<template>
  <div>
    <!-- Profil Butonu -->
    <button class="top-right-button" @click="showModal = true">
      <span class="material-icons">account_circle</span>
      {{ loggedInUser ? loggedInUser.name : "" }}
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div v-if="!currentPage && loggedInUser">
          <!-- Hoşgeldiniz Ekranı -->
          <h3>Hoşgeldiniz, {{ loggedInUser.name }} {{ loggedInUser.surname }}!</h3>
          <div class="button-group">
            <button @click="openOrdersPage" class="orders">
              <span class="material-icons">shop</span>
              Siparişlerim
            </button>
            <button @click="openReturnsPage" class="returns">
              <span class="material-icons">keyboard_return</span>
              İadeler
            </button>
            <button @click="openCServicesPage" class="customer-services">
              <span class="material-icons">support_agent</span>
              Müşteri Hizmetleri
            </button>
            <button @click="logout" class="logout-button">
              <span class="material-icons">logout</span>
              Çıkış Yap</button>
            <button @click="closeModal" class="close-button">
              <span class="material-icons">close</span>
              Kapat</button>
          </div>
        </div>
        <div v-else-if="!currentPage">
          <!-- Seçenekler Ekranı -->
          <h3>Giriş Yap/Kayıt Ol</h3>
          <button @click="openLogin" class="modal-button">Giriş Yap</button>
          <button @click="openRegister" class="modal-button">Kayıt Ol</button>
          <button @click="closeModal" class="close-button">
            <span class="material-icons">close</span>
            Kapat</button>
        </div>
        <div v-else-if="currentPage === 'login'">
          <!-- Login Form -->
          <LoginForm @login="setLoggedInUser" @back="goBack" />
        </div>
        <div v-else-if="currentPage === 'register'">
          <!-- Register Form -->
          <RegisterForm @register="handleRegister" @back="goBack" />
        </div>

        <!-- Siparişlerim Ekranı -->
        <div v-else-if="currentPage === 'orders'" class="orders-page">
          <h3>Siparişlerim</h3>
          <div v-if="userOrders.length === 0" class="no-orders">
            <p>Herhangi Bir Siparişiniz Bulunmamaktadır.</p>
          </div>
          <div v-else class="orders-list">
            <div v-for="order in userOrders" :key="order.id" class="order-item">
              <div class="order-header">
                <p class="order-date">Sipariş Tarihi: {{ formatDate(order.orderDate) }}</p>
                <div class="order-actions">
                  <p class="order-total">Toplam Tutar: {{ order.totalAmount }} TL</p>
                  <div v-if="isOrderFullyReturned(order.id)" class="return-status fully-returned">
                    Tüm Ürünler İade Edildi
                  </div>
                  <button 
                    v-else-if="canReturn(order.orderDate) && !isOrderFullyReturned(order.id)" 
                    @click="returnEntireOrder(order)" 
                    class="return-btn"
                  >
                    Tüm Siparişi İade Et
                  </button>
                </div>
              </div>
              <div class="order-products">
                <div v-for="item in order.items" :key="item.productId" class="order-product">
                  <img :src="item.image" :alt="item.name" class="product-image">
                  <div class="product-details">
                    <div class="product-header">
                      <h4>{{ item.name }}</h4>
                      <div 
                        v-if="isProductReturned(order.id, item.productId)" 
                        class="return-status"
                      >
                        İade Edildi
                      </div>
                    </div>
                    <p>Adet: {{ item.quantity }}</p>
                    <p>Birim Fiyat: {{ item.price }} TL</p>
                    <p>Toplam: {{ item.totalPrice }} TL</p>
                    <button 
                      v-if="canReturn(order.orderDate) && !isProductReturned(order.id, item.productId)" 
                      @click="returnItem(order, item)" 
                      class="return-item-btn"
                    >
                      İade Et
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button @click="goBack" class="back-button">Geri</button>
        </div>

        <!-- İadeler Ekranı -->
        <div v-else-if="currentPage === 'returns'" class="returns-page">
          <h3>İadelerim</h3>
          <div v-if="userReturns.length === 0" class="no-returns">
            <p>Herhangi Bir İadeniz Bulunmamaktadır.</p>
          </div>
          <div v-else class="returns-list">
            <div v-for="return_ in userReturns" :key="return_.id" class="return-item">
              <div class="return-header">
                <p class="return-date">İade Tarihi: {{ formatDate(return_.returnDate) }}</p>
                <p class="return-total">İade Tutarı: {{ return_.totalAmount }} TL</p>
              </div>
              <div class="return-products">
                <div v-for="item in return_.items" :key="item.productId" class="return-product">
                  <img :src="item.image" :alt="item.name" class="product-image">
                  <div class="product-details">
                    <h4>{{ item.name }}</h4>
                    <p>Adet: {{ item.quantity }}</p>
                    <p>Birim Fiyat: {{ item.price }} TL</p>
                    <p>Toplam: {{ item.totalPrice }} TL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button @click="goBack" class="back-button">Geri</button>
        </div>

        <!-- Müşteri Hizmetleri Ekranı -->
        <div v-else-if="currentPage === 'customer-services'">
          <h3>Bize Ulaşın</h3>
          <h4>Mail Adresimiz: contact.tr@pullandbear.com </h4>
          <h4>Telefon Numaramız: +90 (534) 982 5582</h4>
          <button @click="goBack" class="back-button">Geri</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import { useNuxtApp } from '#app';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      showModal: false,
      currentPage: null,
      loggedInUser: null,
      userOrders: [],
      userReturns: [],
    };
  },
  methods: {
    openLogin() {
      this.currentPage = "login";
    },
    openRegister() {
      this.currentPage = "register";
    },
    async openOrdersPage() {
      this.currentPage = "orders";
      await this.loadUserOrders();
    },
    async openReturnsPage() {
      this.currentPage = "returns";
      await this.loadUserReturns();
    },
    openCServicesPage() {
      this.currentPage = "customer-services";
    },
    closeModal() {
      this.showModal = false;
      this.currentPage = null;
    },
    goBack() {
      this.currentPage = null;
    },
    async setLoggedInUser(user) {
      try {
        const { $db } = useNuxtApp();
        // Kullanıcı bilgilerini tekrar kontrol et
        const userDoc = await getDoc(doc($db, 'users', user.id));
        
        if (userDoc.exists()) {
          this.loggedInUser = { id: userDoc.id, ...userDoc.data() };
          // Kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
          // Üst komponente kullanıcı bilgisini ilet
          this.$emit('user-logged-in', this.loggedInUser);
          
          alert(`Giriş başarılı! Hoşgeldiniz, ${this.loggedInUser.name} ${this.loggedInUser.surname}`);
          this.goBack();
        } else {
          alert('Kullanıcı bulunamadı!');
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata:', error);
        alert('Bir hata oluştu!');
      }
    },
    handleRegister(userData) {
      // Kayıt başarılı olduğunda otomatik giriş yap
      this.setLoggedInUser(userData);
    },
    logout() {
      this.loggedInUser = null;
      // localStorage'dan kullanıcı bilgilerini sil
      localStorage.removeItem('loggedInUser');
      // Üst komponente çıkış yapıldığını bildir
      this.$emit('user-logged-out');
      alert("Çıkış yapıldı!");
      this.closeModal();
    },
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
    checkLoggedInUser() {
      const savedUser = localStorage.getItem('loggedInUser');
      if (savedUser) {
        this.loggedInUser = JSON.parse(savedUser);
        // Üst komponente kullanıcı bilgisini ilet
        this.$emit('user-logged-in', this.loggedInUser);
      }
    },
    async loadUserOrders() {
      if (!this.loggedInUser) return;

      try {
        const { $db } = useNuxtApp();
        const ordersRef = collection($db, 'orders');
        const q = query(ordersRef, where('userId', '==', this.loggedInUser.id));
        const querySnapshot = await getDocs(q);
        
        this.userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate.toDate()
        }));

        // Siparişleri tarihe göre sırala (en yeniden en eskiye)
        this.userOrders.sort((a, b) => b.orderDate - a.orderDate);
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    canReturn(orderDate) {
      const now = new Date();
      const orderTime = new Date(orderDate);
      const diffInMinutes = (now - orderTime) / (1000 * 60);
      return diffInMinutes <= 1;
    },
    async returnItem(order, item) {
      if (!this.canReturn(order.orderDate)) {
        alert('Sipariş Verildikten 1 Dakika Sonra İade Edilemez');
        return;
      }

      try {
        const { $db } = useNuxtApp();
        
        // İade kaydı oluştur
        const returnData = {
          userId: this.loggedInUser.id,
          orderId: order.id,
          items: [{
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            totalPrice: item.totalPrice
          }],
          totalAmount: item.totalPrice,
          returnDate: new Date(),
          orderDate: order.orderDate,
          status: 'completed'
        };

        // Önce iade kaydını oluştur
        await addDoc(collection($db, 'returns'), returnData);

        // Siparişten ürünü kaldır
        const updatedItems = order.items.filter(i => i.productId !== item.productId);
        const updatedTotalAmount = order.totalAmount - item.totalPrice;

        if (updatedItems.length === 0) {
          // Tüm ürünler iade edildiyse siparişi sil
          await deleteDoc(doc($db, 'orders', order.id));
        } else {
          // Siparişi güncelle
          await updateDoc(doc($db, 'orders', order.id), {
            items: updatedItems,
            totalAmount: updatedTotalAmount
          });
        }

        // Siparişleri ve iadeleri yeniden yükle
        await this.loadUserOrders();
        await this.loadUserReturns();
        
        alert('Ürün başarıyla iade edildi.');
      } catch (error) {
        console.error('İade işlemi sırasında hata:', error);
        alert('İade işlemi sırasında bir hata oluştu: ' + error.message);
      }
    },
    async returnEntireOrder(order) {
      if (!this.canReturn(order.orderDate)) {
        alert('Sipariş Verildikten 5 Dakika Sonra İade Edilemez');
        return;
      }

      try {
        const { $db } = useNuxtApp();
        
        // İade kaydı oluştur
        const returnData = {
          userId: this.loggedInUser.id,
          orderId: order.id,
          items: order.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            totalPrice: item.totalPrice
          })),
          totalAmount: order.totalAmount,
          returnDate: new Date(),
          orderDate: order.orderDate,
          status: 'completed'
        };

        // Önce iade kaydını oluştur
        await addDoc(collection($db, 'returns'), returnData);

        // Sonra siparişi sil
        await deleteDoc(doc($db, 'orders', order.id));

        // Siparişleri ve iadeleri yeniden yükle
        await this.loadUserOrders();
        await this.loadUserReturns();
        
        alert('Sipariş başarıyla iade edildi.');
      } catch (error) {
        console.error('İade işlemi sırasında hata:', error);
        alert('İade işlemi sırasında bir hata oluştu: ' + error.message);
      }
    },
    async loadUserReturns() {
      if (!this.loggedInUser) return;

      try {
        const { $db } = useNuxtApp();
        const returnsRef = collection($db, 'returns');
        const q = query(returnsRef, where('userId', '==', this.loggedInUser.id));
        const querySnapshot = await getDocs(q);
        
        this.userReturns = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            returnDate: data.returnDate.toDate(),
            orderDate: data.orderDate.toDate()
          };
        });

        // İadeleri tarihe göre sırala (en yeniden en eskiye)
        this.userReturns.sort((a, b) => b.returnDate - a.returnDate);
      } catch (error) {
        console.error('İadeler yüklenirken hata:', error);
      }
    },
    // Ürünün iade edilip edilmediğini kontrol et
    isProductReturned(orderId, productId) {
      return this.userReturns.some(return_ => 
        return_.orderId === orderId && 
        return_.items.some(item => item.productId === productId)
      );
    },
    // Siparişin tamamen iade edilip edilmediğini kontrol et
    isOrderFullyReturned(orderId) {
      const returns = this.userReturns.filter(return_ => return_.orderId === orderId);
      if (returns.length === 0) return false;

      // Tüm iade edilen ürünlerin ID'lerini topla
      const returnedProductIds = returns.flatMap(return_ => 
        return_.items.map(item => item.productId)
      );

      // İlgili siparişi bul
      const order = this.userOrders.find(order => order.id === orderId);
      if (!order) return false;

      // Siparişteki tüm ürünlerin iade edilip edilmediğini kontrol et
      return order.items.every(item => returnedProductIds.includes(item.productId));
    },
  },
  mounted() {
    this.checkLoggedInUser();
    // Eğer kullanıcı giriş yapmışsa iadeleri yükle
    if (this.loggedInUser) {
        this.loadUserReturns();
    }
  },
  components: {
    LoginForm,
    RegisterForm,
  },
};
</script>

<style scoped>
.top-right-button {
  position: absolute;
  top: 10px;
  right: 110px;
  padding: 5px 20px;
  display: absolute;
  align-items: center;
  gap: 8px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.top-right-button:hover {
  background-color: #000000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Dikey ortalama */
  align-items: center; /* Yatay */
}

.modal-button, .back-button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-button:hover, .orders:hover, .back-button:hover {
  background-color: #000000;
}


.logout-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 100px;
  cursor: pointer;
  margin: 10px 0;
  font-size: 16px;
  width: 80%;

}

.orders {
  background-color: #000000;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 100px;
  cursor: pointer;
  margin: 10px 0;
  font-size: 16px;
  width: 90%;

}

.returns {
  display: block;
  background-color: #000000;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 100px;
  cursor: pointer;
  margin: 5px 0;
  font-size: 16px;
  width: 80%;
}
.customer-services {
  display: block;
  background-color: #000000;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 100px;
  cursor: pointer;
  margin: 5px 0;
  font-size: 16px;
  width: 80%;
}

.logout-button:hover {
  background-color: #ff6666;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Dikey ortalama */
  width: 100%;
  margin-top: 20px; /* Butonlar arasında boşluk */
}


.close-button {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
.back-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.orders-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  max-height: 80vh; /* Maksimum yükseklik ekle */
  overflow-y: auto; /* Dikey scroll ekle */
}

.no-orders {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 20px 0;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 10px; /* Scroll çubuğu için boşluk */
}

.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  min-width: 0; /* Taşmayı önle */
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  flex-wrap: wrap; /* Uzun içerik için satır atlama */
  gap: 10px;
}

.order-date {
  color: #666;
  font-size: 0.9em;
}

.order-total {
  font-weight: bold;
  white-space: nowrap; /* Fiyat tek satırda kalsın */
}

.order-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-product {
  display: flex;
  gap: 15px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  min-width: 0; /* Taşmayı önle */
}

.product-image {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0; /* Resim boyutu sabit kalsın */
}

.product-details {
  flex: 1;
  min-width: 0; /* Taşmayı önle */
  overflow: hidden; /* Taşan içeriği gizle */
}

.product-details h4 {
  margin: 0 0 5px 0;
  font-size: 0.95em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-details p {
  margin: 3px 0;
  color: #666;
  font-size: 0.9em;
}

/* Scroll çubuğu stilleri */
.orders-page::-webkit-scrollbar {
  width: 6px;
}

.orders-page::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.orders-page::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.orders-page::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.return-btn {
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  margin-left: 10px;
}

.return-item-btn {
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  margin-top: 5px;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.returns-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.no-returns {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 20px 0;
}

.returns-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 10px;
}

.return-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
}

.return-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.return-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.return-product {
  display: flex;
  gap: 15px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.return-status {
  font-size: 0.8em;
  color: #ff4d4d;
  background-color: #e8f5e9;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.return-total{
  color: #43e26d;
  margin-left: 10px;
  }

.return-status.fully-returned {
  font-size: 0.9em;
  padding: 4px 12px;
  margin-left: 10px;
}

.product-details h4 {
  margin: 0;
  font-size: 0.95em;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>