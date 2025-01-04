<template>
  <div class="home-page">
    <!-- Logo -->
    <div class="logo-container">
      <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
    </div>
    <Button @user-logged-in="handleUserLogin" @user-logged-out="handleUserLogout" />
    <Sepet ref="sepetComponent" />
    <Menu />
    <Search />
    <ImageWithButton />
    <Carousel />
    <Influencer />
    <Video />
    <Subscription />
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";

// Menü ve Kategoriler
const isMenuVisible = ref(false);
const categories = ["erkek", "kadın"];
const selectedCategory = ref("erkek");

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  isMenuVisible.value = false; // Kategori seçilince menüyü kapat
};

// Componentlerin İmport Edilmesi
import Sepet from "@/components/Sepet.vue";
import Search from "@/components/Search.vue";
import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";
import Carousel from "@/components/Carousel.vue";
import ImageWithButton from "@/components/ImageWithButton.vue";
import Button from "@/components/Button.vue";
import Influencer from "@/components/Influencer.vue";
import Products from "@/components/Products.vue";
import Video from "@/components/Video.vue";
import Subscription from "@/components/Subscription.vue";

const handleUserLogin = (user) => {
  // Sepet bileşenine kullanıcı bilgisini ilet
  if (sepetComponent.value) {
    sepetComponent.value.handleUserLogin(user);
  }
};

const handleUserLogout = () => {
  // Sepet bileşenine çıkış yapıldığını bildir
  if (sepetComponent.value) {
    sepetComponent.value.handleUserLogout();
  }
};

const sepetComponent = ref(null);

// Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
const savedUser = localStorage.getItem('loggedInUser');
if (savedUser && sepetComponent.value) {
  sepetComponent.value.handleUserLogin(JSON.parse(savedUser));
}
</script>

<style scoped>
.home-page {
  padding: 0px;
  text-align: center;
}

.category-selection {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
}

.category-card {
  text-decoration: none;
  color: inherit;
  background-color: #f8f8f8;
  padding: 40px;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

h2 {
  margin: 0;
  font-size: 1.5em;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}

button {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  border-radius: 4px;
  transition: all 0.3s ease;
}

button.active {
  background-color: #f39c12;
  color: white;
  font-weight: bold;
}

button:hover {
  background-color: #e0e0e0;
}

.menu-container {
  margin-top: -20px;
  position: relative;
}

.menu-button {
  display: flex;
  align-items: center;
  color: white;
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.menu-button:hover {
  background-color: black;
}

.menu-list {
  position: absolute;
  top: 50px;
  left: 0;
  background-color: #000000;
  color: white;
  padding: 10px;
  border-radius: 5px;
  width: 200px;
  z-index: 10;
}

.category-options {
  display: flex;
  gap: 10px;
}

.dynamic-component {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}

.logo-container {
  margin-top: 0px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo {
  max-width: 200px;
}
</style> 