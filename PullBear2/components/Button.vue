<template>
  <div>
    <!-- Profil Butonu -->
    <button class="top-right-button" @click="showModal = true">
      <span class="material-icons">account_circle</span>
      {{ loggedInUser ? loggedInUser.name : "" }}
    </button>

    <!-- Modal (Seçenekler veya Hoşgeldiniz Ekranı) -->
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
          <LoginForm :users="users" @login="setLoggedInUser" @back="goBack" />
        </div>
        <div v-else-if="currentPage === 'register'">
          <!-- Register Form -->
          <RegisterForm :users="users" @register="addUser" @back="goBack" />
        </div>

        <!-- Siparişlerim Ekranı -->
        <div v-else-if="currentPage === 'orders'">
          <h3>Herhangi Bir Siparişiniz Bulunmamaktadır.</h3>
          <button @click="goBack" class="back-button">Geri</button>
        </div>

        <!-- İadeler Ekranı -->
        <div v-else-if="currentPage === 'returns'">
          <h3>Herhangi Bir İadeniz Bulunmamaktadır.</h3>
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

export default {
  data() {
    return {
      showModal: false,
      currentPage: null,
      users: [], // Kullanıcıların kaydedileceği liste
      loggedInUser: null, // Giriş yapmış kullanıcı bilgisi
    };
  },
  methods: {
    openLogin() {
      this.currentPage = "login";
    },
    openRegister() {
      this.currentPage = "register";
    },
    openOrdersPage() {
      this.currentPage = "orders";
    },
    openReturnsPage() {
      this.currentPage = "returns";
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
    addUser(newUser) {
      const userExists = this.users.some((user) => user.email === newUser.email);

      if (userExists) {
        alert("Kullanıcı zaten kayıtlı!");
        return;
      }

      this.users.push(newUser);
      alert("Kayıt başarılı!");
      this.setLoggedInUser(newUser); // Yeni kullanıcı giriş yapmış gibi ayarlanır
      this.goBack();
    },
    setLoggedInUser(user) {
      this.loggedInUser = user;
      alert(`Giriş başarılı! Hoşgeldiniz, ${user.name} ${user.surname}`);
      this.goBack();
    },
    logout() {
      this.loggedInUser = null; // Kullanıcıyı çıkış yapmış duruma getir
      alert("Çıkış yapıldı!");
    },
  },
};
</script>

<style scoped>
.top-right-button {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
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
  width: 80%;

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
</style>