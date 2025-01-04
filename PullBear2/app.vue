<template>
    <div id="app">
      
      <!-- Logo -->
      <div class="logo-container">
        <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
      </div>
      <!-- Navbar -->
      <div class="navbar">
        <button
          v-for="(comp, index) in components"
          :key="index"
          @click="toggleComponent(index)"
          :class="{ active: activeComponent === comp.component }"
        >
          {{ comp.name }}
        </button>
      </div>
  
  
      <!-- Dinamik Component -->
      <div class="dynamic-component">
        <component v-if="activeComponent" :is="activeComponent" />
      </div>
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
  

  
  // Component Listesi
  const components = [
    { name: "Sepet", component: Sepet },
    { name: "Search", component: Search },
    { name: "Menu", component: Menu },
    { name: "Footer", component: Footer },
    { name: "Carousel", component: Carousel },
    { name: "ImageWithButton", component: ImageWithButton },
    { name: "Button", component: Button },
    { name: "Influencer", component: Influencer },
    { name: "Products", component: Products },
    { name: "Video", component: Video },
  ];
  
  // Aktif Component
  const activeComponent = ref(null);
  
  // Component Gösterimi Kontrolü
  function toggleComponent(index) {
    activeComponent.value =
      activeComponent.value === components[index].component
        ? null
        : components[index].component;
  }
  </script>
  
  <style scoped>
  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  .navbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
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
    position: relative;
    margin-bottom: 20px;
  }
  
  .menu-button {
    display: flex;
    align-items: center;
    background: red;
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
  .logo-container{
    margin-bottom: 20px;
  }
  </style>
  