<template>
  <div class="carousel-container">
    <!-- Carousel Görselleri -->
    <div class="carousel" :style="carouselStyle">
      <div class="carousel-item" v-for="(item, index) in items" :key="index">
        <img :src="item.imageUrl" :alt="item.title" class="carousel-image" />
      </div>
    </div>

    <!-- Alt Tarafta Yuvarlak Noktalar -->
    <div class="carousel-indicators">
      <span
        v-for="(item, index) in items"
        :key="index"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNuxtApp } from '#app';
import { collection, query, getDocs, orderBy, where, Firestore } from 'firebase/firestore';

interface CarouselItem {
  id: string;
  imageUrl: string;
  title: string;
  order: number;
}

// Carousel için resimler
const items = ref<CarouselItem[]>([]);

// Aktif slayt
const currentIndex = ref<number>(0);

// Kaydırma stili
const carouselStyle = ref({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: "transform 0.5s ease",
});

// Firestore'dan görselleri al
const fetchCarouselImages = async (): Promise<void> => {
  try {
    console.log('Carousel görselleri yükleniyor...');
    const { $db } = useNuxtApp();
    if (!$db) {
      console.error('Firestore bağlantısı bulunamadı ($db undefined)');
      return;
    }
    console.log('Firestore bağlantısı başarılı, koleksiyon sorgulanıyor...');
    
    const carouselRef = collection($db as Firestore, 'carousel');
    const q = query(
      carouselRef,
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Firestore\'dan gelen veri:', querySnapshot.docs.map(doc => doc.data()));
    
    items.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CarouselItem));
    
    console.log('İşlenen carousel verileri:', items.value);
  } catch (error) {
    console.error('Carousel görselleri yüklenirken hata:', error);
    console.error('Hata detayı:', {
      message: (error as Error).message,
      code: (error as { code?: string }).code,
      stack: (error as Error).stack
    });
  }
};

// Geçiş fonksiyonları
const goToSlide = (index: number): void => {
  currentIndex.value = index;
  updateCarouselStyle();
};

const nextSlide = (): void => {
  currentIndex.value = (currentIndex.value + 1) % items.value.length;
  updateCarouselStyle();
};

const updateCarouselStyle = (): void => {
  carouselStyle.value = {
    transform: `translateX(-${currentIndex.value * 100}%)`,
    transition: "transform 0.5s ease",
  };
};

// Component yüklendiğinde
onMounted(async () => {
  console.log('Carousel component yükleniyor...');
  // Görselleri yükle
  await fetchCarouselImages();
  
  // Otomatik geçişi başlat
  if (items.value.length > 0) {
    console.log('Otomatik geçiş başlatılıyor, toplam görsel sayısı:', items.value.length);
    setInterval(nextSlide, 5000);
  } else {
    console.log('Görsel bulunamadı, otomatik geçiş başlatılmıyor');
  }
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 40px);
  margin: 0 auto;
  overflow: hidden;
}

.carousel {
  display: flex;
  width: 100%;
  height: 100%;
}

.carousel-item {
  flex: 0 0 100%;
  overflow: hidden;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  cursor: pointer;
}

.indicator.active {
  background: rgba(0, 0, 0, 0.9);
}

.indicator:hover {
  background: rgba(0, 0, 0, 0.7);
}
</style>