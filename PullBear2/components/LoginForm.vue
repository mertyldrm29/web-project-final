<template>
    <div class="form-container">
      <h3>Giriş Yap</h3>
      <input v-model="email" type="email" placeholder="E-posta Adresi" />
      <input v-model="password" type="password" placeholder="Şifre" />
      <button @click="handleLogin">Giriş Yap</button>
      <button @click="$emit('back')" class="back-button">Geri</button>
  
      <!-- Hata Mesajı -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { useNuxtApp } from '#app';

  export default {
    data() {
      return {
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      async handleLogin() {
        if (!this.email || !this.password) {
          this.errorMessage = "Tüm alanları doldurmanız gerekiyor!";
          return;
        }
  
        try {
          const { $db } = useNuxtApp();
          const usersRef = collection($db, 'users');
          const q = query(usersRef, 
            where('email', '==', this.email),
            where('password', '==', this.password)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            this.errorMessage = "E-posta veya şifre hatalı!";
            return;
          }
  
          const userDoc = querySnapshot.docs[0];
          const userData = {
            id: userDoc.id,
            ...userDoc.data()
          };
  
          this.$emit("login", userData);
        } catch (error) {
          console.error('Giriş hatası:', error);
          this.errorMessage = "Giriş yapılırken bir hata oluştu!";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
    margin: 50px auto;
  }
  
  input {
    padding: 10px;
    border: 1px solid #000000;
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
    background-color: #000000;
    color: white;
  }
  .error-message {
  color: red;
  margin-top: 10px;
}
  </style>
  