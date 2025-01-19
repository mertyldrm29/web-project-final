<template>
  <footer class="footer" v-if="footerData">
    <div v-for="section in footerData.sections" :key="section.title" class="footer-section">
      <h3>{{ section.title }}</h3>

      <!-- Uygulama Linkleri -->
      <div v-if="section.type === 'app'" class="app-links">
        <a v-for="link in section.links" 
           :key="link.url" 
           :href="link.url" 
           target="_blank">
          <img :src="link.imageUrl" :alt="link.alt" />
        </a>
      </div>

      <!-- Ödeme Yöntemleri -->
      <div v-if="section.type === 'payment'" class="payment-methods">
        <img v-for="method in section.methods" 
             :key="method.alt"
             :src="method.imageUrl" 
             :alt="method.alt" />
      </div>

      <!-- Sosyal Medya -->
      <div v-if="section.type === 'social'" class="social-links">
        <a v-for="link in section.links" 
           :key="link.url" 
           :href="link.url" 
           target="_blank">
          <img :src="link.imageUrl" :alt="link.alt" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { collection, query, getDocs, where, limit } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'

interface Link {
  url: string
  imageUrl: string
  alt: string
}

interface PaymentMethod {
  imageUrl: string
  alt: string
}

interface FooterSection {
  title: string
  type: 'app' | 'payment' | 'social'
  links?: Link[]
  methods?: PaymentMethod[]
}

interface FooterData {
  sections: FooterSection[]
  isActive: boolean
}

const footerData = ref<FooterData | null>(null)

const fetchFooterData = async (): Promise<void> => {
  try {
    console.log('Footer verileri yükleniyor...')
    const { $db } = useNuxtApp()
    if (!$db) {
      console.error('Firestore bağlantısı bulunamadı ($db undefined)')
      return
    }

    const db = $db as Firestore
    const footerRef = collection(db, 'footer')
    const q = query(
      footerRef,
      where('isActive', '==', true),
      limit(1)
    )

    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      footerData.value = doc.data() as FooterData
      console.log('Footer verileri yüklendi:', footerData.value)
    }
  } catch (error) {
    console.error('Footer verileri yüklenirken hata:', error)
  }
}

onMounted(() => {
  fetchFooterData()
})
</script>

<style scoped>
.footer {
  background-color: #f8f8f8;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  border-top: 2px solid #ddd;
}

.footer-section {
  flex: 1 1 30%;
  text-align: center;
}

.footer-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.app-links a img,
.payment-methods img,
.social-links a img {
  width: 60px;
  height: auto;
  margin: 5px;
  transition: transform 0.3s ease;
}

.app-links a img:hover,
.payment-methods img:hover,
.social-links a img:hover {
  transform: scale(1.1);
}

.payment-methods {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-links a img {
  width: 40px;
  height: 40px;
}
</style>
