<template>
    <div>
      <h3>Kayıt Ol</h3>
      <form @submit.prevent="register" class="register-form">
        <input v-model="name" type="text" placeholder="Ad" required />
        <input v-model="surname" type="text" placeholder="Soyad" required />
        <input v-model="email" type="email" placeholder="E-posta" required />
        <input v-model="password" type="password" placeholder="Şifre" required />
        <button type="submit" class="form-button">Kayıt Ol</button>
        <button type="button" @click="$emit('back')" class="form-button">Geri</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
  import { useNuxtApp } from '#app';

  export default {
    data() {
      return {
        name: "",
        surname: "",
        email: "",
        password: "",
        errorMessage: "",
        successMessage: "",
      };
    },
    methods: {
      async register() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!this.name || !this.surname || !this.email || !this.password) {
          this.errorMessage = "Lütfen tüm alanları doldurun!";
          this.successMessage = "";
          return;
        }
  
        if (!emailRegex.test(this.email)) {
          this.errorMessage = "Lütfen geçerli bir e-posta adresi girin!";
          this.successMessage = "";
          return;
        }

        try {
          const { $db } = useNuxtApp();
          
          // E-posta adresi kontrolü
          const usersRef = collection($db, 'users');
          const q = query(usersRef, where('email', '==', this.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            this.errorMessage = "Bu e-posta adresi zaten kayıtlı!";
            this.successMessage = "";
            return;
          }

          // Yeni kullanıcı oluştur
          const newUser = {
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
            createdAt: new Date()
          };

          const docRef = await addDoc(collection($db, 'users'), newUser);
          
          // Başarı mesajını göster
          this.successMessage = "Kayıt başarılı! Giriş yapılıyor...";
          this.errorMessage = "";

          // Kullanıcı ID'sini ekleyerek emit et ve otomatik giriş yap
          const userData = { id: docRef.id, ...newUser };
          this.$emit("register", userData);

          // Formu sıfırla
          this.name = "";
          this.surname = "";
          this.email = "";
          this.password = "";
        } catch (error) {
          console.error('Kayıt hatası:', error);
          this.errorMessage = "Kayıt olurken bir hata oluştu!";
          this.successMessage = "";
        }
      },
    },
  };
  </script>
  
 

  
  <style scoped>
  .register-form {
  display: flex;
  flex-direction: column;
}

.form-button {
  display: block; /* Alt alta durmalarını sağlar */
  width: 100%; /* Butonların form genişliğini kaplamasını sağlar */
  padding: 10px;
  margin: 10px 0; /* Butonlar arasında boşluk bırakır */
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #000000;
}
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
    margin: 50px auto;
  }
  
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #000000;
    color: white;
  }
  
  .back-button {
    background-color: #929292;
    color: white;
  }
  .error-message {
  color: red;
  margin-top: 10px;
}
  .success-message {
    color: green;
    margin-top: 10px;
  }
  </style>
