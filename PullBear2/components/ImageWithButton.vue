<template>
    <div class="image-container">
      <!-- Arka planda gösterilecek resim -->
      <img :src="imageUrl" alt="Arka Plan Resmi" class="background-image" v-if="imageUrl" />
      <div v-else class="loading">Yükleniyor...</div>
  
      <!-- Buton -->
      <button class="overlay-button" @click="navigateToNewProducts">Yeni Ürünler</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNuxtApp } from '#app'
  import { collection, getDocs, query, limit } from 'firebase/firestore'
  
  const router = useRouter()
  const imageUrl = ref('')
  
  // Firestore'dan resim URL'sini al
  const fetchImageUrl = async () => {
    try {
      const { $db } = useNuxtApp()
      const bannerRef = collection($db, 'banners')
      const q = query(bannerRef, limit(1)) // İlk banner'ı al
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const bannerData = querySnapshot.docs[0].data()
        imageUrl.value = bannerData.imageUrl
      }
    } catch (error) {
      console.error('Banner resmi yüklenirken hata:', error)
    }
  }
  
  // Yeni ürünler sayfasına yönlendirme
  const navigateToNewProducts = () => {
    router.push('/new-products')
  }
  
  // Component yüklendiğinde resmi getir
  onMounted(() => {
    fetchImageUrl()
  })
  </script>
  
  <style scoped>
  /* Görsel ve buton kapsayıcısı */
  .image-container {
    position: relative;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  
  /* Arka plan resmi */
  .background-image {
    width: 100%;
    height: auto;
    display: block;
  }
  
  /* Butonun konumu */
  .overlay-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  /* Hover durumunda buton */
  .overlay-button:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  /* Yükleme durumu için stil */
  .loading {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    color: #666;
  }
  </style>
  