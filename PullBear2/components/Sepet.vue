<!-- Sepet.vue -->
<template>
    <div class="cart-container">
      <!-- Sepet İkonu ve Yazısı -->
      <button
        type="button"
        id="buttonShopCart"
        class="c-button c-button--basket"
        aria-label="Sepeti görüntüle"
        @click="toggleCart"
      >
        <span class="button-text">
          <span class="icon icon-nav-shop">
            <svg role="presentation" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 9H20L19.1654 18.1811C19.0717 19.2112 18.208 20 17.1736 20H6.82643C5.79202 20 4.92829 19.2112 4.83464 18.1811L4 9Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linejoin="round"
              ></path>
              <path
                d="M8 11V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V11"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </svg>
          </span>
          <span class="count">Sepet ({{ cartItems.length }})</span>
        </span>
      </button>
  
      <!-- Sepet Paneli -->
      <div :class="['cart-panel', { open: isCartOpen }]">
        <div class="cart-panel-header">
          <h2>Sepet</h2>
          <button @click="toggleCart" class="close-button">Kapat</button>
        </div>
        <div class="cart-panel-content">
          <p v-if="cartItems.length === 0">Sepetiniz boş.</p>
          <div v-else>
            <p v-if="cartItems.length > 0">Sepetinizde {{ cartItems.length }} ürün var.</p>
            <ul>
              <li v-for="(item, index) in cartItems" :key="index">
                <div class="cart-item">
                  <img :src="item.image" alt="Ürün resmi" class="cart-item-image" />
                  <span>{{ item.name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Sepet paneli durumu ve ürün listesi
  const isCartOpen = ref(false) // Panelin açık/kapalı durumu
  const cartItems = ref([]) // Sepetteki ürünler
  
  // Sepet panelini açıp kapatan fonksiyon
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }
  
  // Ürün ekleme fonksiyonu (Örnek ürün ekleyelim)
  const addToCart = (item) => {
    cartItems.value.push(item)
  }
  
  // Örnek ürün eklemek için kullanılabilir
  addToCart({ name: 'Örnek Ürün', image: 'https://via.placeholder.com/150' })
  </script>
  
  <style scoped>
  /* Sepet Konteyneri */
  .cart-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    flex: 0 0 auto;
  }
  
  /* Sepet İkonu */
  #buttonShopCart {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .button-text .count {
    font-size: 16px;
    font-weight: bold;
    margin-left: 8px;
  }
  
  /* Sepet Paneli */
  .cart-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: #fff;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transform: translateX(100%); /* Başlangıçta gizli olacak */
    transition: transform 0.3s ease;
  }
  
  /* Panel Başlığı */
  .cart-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  
  /* Panel İçeriği */
  .cart-panel-content {
    padding: 20px;
    flex: 1;
  }
  
  /* Sepet Paneli Açıldığında Görünür Olacak */
  .cart-panel.open {
    transform: translateX(0); /* Panel sağa kayacak */
  }
  
  /* Sepet Ürün Stili */
  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .cart-item img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  </style>
  