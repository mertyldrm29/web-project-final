<template>
    <div class="form-container">
      <h3>Giriş Yap</h3>
      <input v-model="email" type="email" placeholder="E-posta Adresi" />
      <input v-model="password" type="password" placeholder="Şifre" />
      <button @click="handleLogin">Giriş Yap</button>
      <button @click="emit('back')" class="back-button">Geri</button>
  
      <!-- Hata Mesajı -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import type { Firestore } from 'firebase/firestore'
import { useAuthStore } from '~/stores/auth'
import type { User } from '~/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { $db } = useNuxtApp()
const db = $db as Firestore

const email = ref<string>("")
const password = ref<string>("")
const errorMessage = ref<string>("")

const emit = defineEmits<{
  (e: 'login', userData: User): void
  (e: 'back'): void
}>()

const handleLogin = async (): Promise<void> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value || !password.value) {
    errorMessage.value = "Tüm alanları doldurmanız gerekiyor!"
    return
  }

  if (!emailRegex.test(email.value)) {
    errorMessage.value = "Lütfen geçerli bir e-posta adresi girin!"
    return
  }

  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, 
      where('email', '==', email.value),
      where('password', '==', password.value)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      errorMessage.value = "E-posta veya şifre hatalı!"
      return
    }

    const userDoc = querySnapshot.docs[0]
    const userData = {
      id: userDoc.id,
      ...userDoc.data()
    } as User

    emit("login", userData)
  } catch (error) {
    console.error('Giriş hatası:', error)
    errorMessage.value = "Giriş yapılırken bir hata oluştu!"
  }
}
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
  