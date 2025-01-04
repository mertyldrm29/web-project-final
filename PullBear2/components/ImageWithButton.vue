<template>
    <div class="image-container">
      <!-- Arka planda gösterilecek resim -->
      <img src="https://static.pullandbear.net/assets/public/f95b/1480/812840559ee7/9556c5a6549f/NEW-H/NEW-H.jpg?ts=1732722054160&w=2543&f=auto" alt="Arka Plan Resmi" class="background-image" />
  
      <!-- Buton -->
      <button class="overlay-button" @click="navigateToNewProducts">Yeni Ürünler</button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router' // Nuxt Router için
  
  const router = useRouter()
  
  // Yeni ürünler sayfasına yönlendirme
  const navigateToNewProducts = () => {
    router.push('/new-products') // 'new-products' rotasını hedefliyor
  }
  </script>
  
  <style scoped>
  /* Görsel ve buton kapsayıcısı */
  .image-container {
    position: relative;
    width: 100%;
     /* Görselin genişliğini sınırlayabilirsiniz */
    margin: 0 auto; /* Ortalamak için */
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
    top: 50%; /* Ortada */
    left: 50%; /* Ortada */
    transform: translate(-50%, -50%); /* Tam merkezleme */
    background-color: rgba(0, 0, 0, 0.6); /* Şeffaf siyah arka plan */
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
  </style>
  