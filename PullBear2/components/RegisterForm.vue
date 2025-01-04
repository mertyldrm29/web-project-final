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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: "",
        surname: "",
        email: "",
        password: "",
      };
    },
    methods: {
      register() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!this.name || !this.surname || !this.email || !this.password) {
          alert("Lütfen tüm alanları doldurun!");
          return;
        }
  
        if (!emailRegex.test(this.email)) {
          alert("Lütfen geçerli bir e-posta adresi girin!");
          return;
        }
  
        const newUser = {
          name: this.name,
          surname: this.surname,
          email: this.email,
          password: this.password,
        };
  
        this.$emit("register", newUser);
  
        // Formu sıfırlama
        this.name = "";
        this.surname = "";
        this.email = "";
        this.password = "";
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
  </style>
