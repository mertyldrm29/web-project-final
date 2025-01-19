<template>
    <div>
      <h3>Kayıt Ol</h3>
      <form @submit.prevent="register" class="register-form">
        <input v-model="name" type="text" placeholder="Ad" required />
        <input v-model="surname" type="text" placeholder="Soyad" required />
        <input v-model="email" type="email" placeholder="E-posta" required />
        <input v-model="password" type="password" placeholder="Şifre" required />
        <button type="submit" class="form-button">Kayıt Ol</button>
        <button type="button" @click="emit('back')" class="form-button">Geri</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import type { Firestore } from 'firebase/firestore'
import type { User } from '~/stores/auth'

const { $db } = useNuxtApp()
const db = $db as Firestore

const name = ref<string>("")
const surname = ref<string>("")
const email = ref<string>("")
const password = ref<string>("")
const errorMessage = ref<string>("")
const successMessage = ref<string>("")

const emit = defineEmits<{
  (e: 'register', userData: User): void
  (e: 'back'): void
}>()

const register = async (): Promise<void> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!name.value || !surname.value || !email.value || !password.value) {
    errorMessage.value = "Lütfen tüm alanları doldurun!"
    successMessage.value = ""
    return
  }

  if (!emailRegex.test(email.value)) {
    errorMessage.value = "Lütfen geçerli bir e-posta adresi girin!"
    successMessage.value = ""
    return
  }

  try {
    // E-posta adresi kontrolü
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email.value))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      errorMessage.value = "Bu e-posta adresi zaten kayıtlı!"
      successMessage.value = ""
      return
    }

    // Yeni kullanıcı oluştur
    const newUser = {
      name: name.value,
      surname: surname.value,
      email: email.value,
      password: password.value,
      createdAt: new Date()
    }

    const docRef = await addDoc(collection(db, 'users'), newUser)
    
    // Başarı mesajını göster
    successMessage.value = "Kayıt başarılı! Giriş yapılıyor..."
    errorMessage.value = ""

    // Kullanıcı ID'sini ekleyerek emit et ve otomatik giriş yap
    const userData = { id: docRef.id, ...newUser } as User
    emit("register", userData)

    // Formu sıfırla
    name.value = ""
    surname.value = ""
    email.value = ""
    password.value = ""
  } catch (error) {
    console.error('Kayıt hatası:', error)
    errorMessage.value = "Kayıt olurken bir hata oluştu!"
    successMessage.value = ""
  }
}
</script>
  
<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
}

.form-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
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
