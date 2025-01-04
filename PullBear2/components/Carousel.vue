<template>
  <div class="carousel-container">
    <!-- Carousel Görselleri -->
    <div class="carousel" :style="carouselStyle">
      <div class="carousel-item" v-for="(item, index) in items" :key="index">
        <img :src="item" alt="Carousel Image" class="carousel-image" />
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

<script setup>
import { ref, onMounted } from "vue";

// Carousel için resimler
const items = [
  "https://static.pullandbear.net/assets/public/2307/702b/027c4fc09212/6e6116667739/CALZADO-H/CALZADO-H.jpg?ts=1732197221012&w=2543&f=auto",
  "https://static.pullandbear.net/assets/public/87b4/ec69/582d4934b11d/851931621b1e/NEW-H/NEW-H.jpg?ts=1732721697375&w=2543&f=auto",
  "https://static.pullandbear.net/assets/public/867f/d4e4/11bd46a7adff/e9d3dac376a3/fiesta-H/fiesta-H.jpg?ts=1732722920303&w=2543&f=auto",
  "https://static.pullandbear.net/assets/public/c356/1e47/f4ea4c21a005/54822da0e688/PORTADA-BF-H/PORTADA-BF-H.jpg?ts=1732543097729&w=2543&f=auto",
  "https://static.pullandbear.net/assets/public/81ae/0b1d/25784eabb8dd/34d26a8e4120/abrigo-h/abrigo-h.png?ts=1732197218275&w=2543",
];

// Aktif slayt
const currentIndex = ref(0);

// Kaydırma stili
const carouselStyle = ref({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: "transform 0.5s ease",
});

// Geçiş fonksiyonları
const goToSlide = (index) => {
  currentIndex.value = index;
  updateCarouselStyle();
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % items.length;
  updateCarouselStyle();
};

const updateCarouselStyle = () => {
  carouselStyle.value = {
    transform: `translateX(-${currentIndex.value * 100}%)`,
    transition: "transform 0.5s ease",
  };
};

// Otomatik geçiş
onMounted(() => {
  setInterval(nextSlide, 5000);
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 40px); /* Yuvarlaklara alan bırak */
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

/* Alt Tarafta Yuvarlak Noktalar */
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
