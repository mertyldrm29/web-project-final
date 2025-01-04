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
  export default {
    data() {
      return {
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    props: {
      users: {
        type: Array,
        required: true,
      },
    },
    methods: {
      handleLogin() {
        if (!this.email || !this.password) {
          this.errorMessage = "Tüm alanları doldurmanız gerekiyor!";
          return;
        }
  
        const user = this.users.find(
          (u) => u.email === this.email && u.password === this.password
        );
  
        if (!user) {
          this.errorMessage = "E-posta veya şifre hatalı!";
          return;
        }
  
        this.$emit("login", user); // Giriş yapan kullanıcı bilgisi gönderilir
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
  