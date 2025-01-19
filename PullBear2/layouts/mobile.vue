<template>
  <div class="mobile-layout">
    <!-- Header -->
    <header class="mobile-header">
      <div class="logo-container">
        <NuxtLink to="/">
          <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mobile-content">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="mobile-nav">
      <div class="nav-item" @click="$router.push('/')">
        <i class="fas fa-home"></i>
        <span>Ana Sayfa</span>
      </div>
      <div class="nav-item" @click="$router.push('/search')">
        <i class="fas fa-search"></i>
        <span>Ara</span>
      </div>
      <div class="nav-item" @click="$router.push('/new-products')">
        <i class="fas fa-tshirt"></i>
        <span>Yeni</span>
      </div>
      <div class="nav-item" @click="toggleCart">
        <i class="fas fa-shopping-cart"></i>
        <span>Sepet</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const toggleCart = (): void => {
  cartStore.toggleCart()
}
</script>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.logo-container {
  text-align: center;
}

.logo {
  max-width: 120px;
  height: auto;
}

.mobile-content {
  flex: 1;
  padding: 70px 10px 60px;
  overflow-y: auto;
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: white;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: pointer;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-item span {
  font-size: 12px;
}

/* Tablet Tasarım */
@media screen and (min-width: 769px) {
  .mobile-layout {
    display: none;
  }
}
</style> 