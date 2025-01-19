<template>
    <div class="influencers-container">
      <div 
        v-for="influencer in influencers" 
        :key="influencer.id" 
        class="influencer-item"
      >
        <a :href="influencer.url" target="_blank" rel="noopener noreferrer">
          <img 
            :src="influencer.image" 
            :alt="influencer.name" 
            class="influencer-image" />
        </a>
        <h3 class="influencer-name">{{ influencer.name }}</h3>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useNuxtApp } from '#app'
  import { collection, query, getDocs, orderBy, where, Firestore } from 'firebase/firestore'

  interface Influencer {
    id: string;
    name: string;
    image: string;
    url: string;
    order: number;
  }

  const influencers = ref<Influencer[]>([])

  const fetchInfluencers = async (): Promise<void> => {
    try {
      console.log('Influencer verileri yükleniyor...')
      const { $db } = useNuxtApp()
      if (!$db) {
        console.error('Firestore bağlantısı bulunamadı ($db undefined)')
        return
      }
      console.log('Firestore bağlantısı başarılı')

      const influencersRef = collection($db as Firestore, 'influencers')
      const q = query(
        influencersRef,
        orderBy('order', 'asc')
      )

      const querySnapshot = await getDocs(q)
      console.log('Firestore\'dan gelen veri:', querySnapshot.docs.map(doc => doc.data()))
      
      influencers.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Influencer))
      
      console.log('İşlenen influencer verileri:', influencers.value)
    } catch (error) {
      console.error('Influencer\'lar yüklenirken hata:', error)
      console.error('Hata detayı:', {
        message: (error as Error).message,
        code: (error as { code?: string }).code,
        stack: (error as Error).stack
      })
    }
  }

  onMounted(() => {
    console.log('Influencer component yükleniyor...')
    fetchInfluencers()
  })
  </script>
  
  <style scoped>
  .influencers-container {
    display: flex;
    justify-content: center;
    gap: 50px;
    flex-wrap: wrap;
    background-color: black;
  }
  
  .influencer-item {
    padding-top: 10px;
    text-align: center;
  }
  
  .influencer-image {
    width: 330px;
    height: 410px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid #ddd;
    transition: transform 0.3s ease;
  }
  
  .influencer-image:hover {
    transform: scale(1.05);
  }
  
  .influencer-name {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    color: white;
  }

  a {
    text-decoration: none;
  }
  </style>
  