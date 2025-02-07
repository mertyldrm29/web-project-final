<template>
  <div class="subscription-container">
    <!-- Subscription Form -->
    <div v-if="!showUnsubscribeForm">
      <h2 class="title">Mükemmel buluşma:</h2>
      <h3 class="subtitle">SON MODAYI %10 İNDİRİMLE TAKİP ET</h3>
      <p class="description">Tüm trendleri, iş birliklerini ve özel kampanyaları keşfetmeye hazır ol!</p>
      
      <form @submit.prevent="handleSubmit" class="subscription-form">
        <input 
          v-model="email" 
          type="email" 
          placeholder="E-posta" 
          class="email-input"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        >
        <button type="submit" class="submit-button">İlgileniyorum</button>
      </form>
      
      <div class="links">
        <a href="#" @click.prevent="toggleUnsubscribeForm">Aboneliğimi iptal etmek istiyorum</a>
        <a href="#" @click.prevent="toggleTerms">Koşulları incele</a>
      </div>
    </div>

    <!-- Unsubscribe Form -->
    <div v-else class="unsubscribe-form">
      <h2 class="title">ABONELİKTEN ÇIKMAK MI İSTİYORSUN?</h2>
      <p class="description">Senin için kolaylaştıracağız!</p>
      
      <form @submit.prevent="handleUnsubscribe" class="subscription-form">
        <input 
          v-model="unsubscribeEmail" 
          type="email" 
          placeholder="E-posta" 
          class="email-input"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        >
        <button type="submit" class="submit-button">ABONELİKTEN ÇIKMAK İSTİYORUM</button>
      </form>
      
      <a href="#" @click.prevent="toggleUnsubscribeForm" class="back-link">Geri</a>
    </div>

    <!-- Terms Popup -->
    <div v-if="showTermsPopup" class="popup-overlay">
      <div class="popup-content">
        <button class="close-button" @click="toggleTerms">×</button>
        <h2>Sadece online satışta</h2>
        <p>7 gün boyunca, 1200 TL üzeri alışverişlerde geçerli %10 indirim.</p>
        <p>Diğer kampanyalarla birleştirilemez. Özel koleksiyonlarda geçerli değildir.</p>
        <button class="confirm-button" @click="toggleTerms">Onayla</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface EmitsInterface {
  (e: 'subscribe', email: string): void
  (e: 'unsubscribe', email: string): void
}

const emit = defineEmits<EmitsInterface>()

const email = ref<string>('')
const unsubscribeEmail = ref<string>('')
const showTermsPopup = ref<boolean>(false)
const showUnsubscribeForm = ref<boolean>(false)

const handleSubmit = async (): Promise<void> => {
  if (email.value && isValidEmail(email.value)) {
    emit('subscribe', email.value)
    email.value = ''
  }
}

const handleUnsubscribe = async (): Promise<void> => {
  if (unsubscribeEmail.value && isValidEmail(unsubscribeEmail.value)) {
    emit('unsubscribe', unsubscribeEmail.value)
    unsubscribeEmail.value = ''
    showUnsubscribeForm.value = false
  }
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const toggleUnsubscribeForm = (): void => {
  showUnsubscribeForm.value = !showUnsubscribeForm.value
  unsubscribeEmail.value = ''
}

const toggleTerms = (): void => {
  showTermsPopup.value = !showTermsPopup.value
}
</script>

<style scoped>
.subscription-container {
  max-width: 350px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.subscription-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.email-input {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Times New Roman', Times, serif;
}

.submit-button {
  padding: 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #333;
}

.links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.links a, .back-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.links a:hover, .back-link:hover {
  text-decoration: underline;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  position: relative;
  max-width: 500px;
  width: 90%;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
}

.confirm-button {
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: background-color 0.3s;
}

.confirm-button:hover {
  background-color: #333;
}

.popup-content h2 {
  margin-bottom: 1rem;
}

.popup-content p {
  margin-bottom: 0.5rem;
  color: #666;
}

.unsubscribe-form {
  text-align: center;
}
</style> 