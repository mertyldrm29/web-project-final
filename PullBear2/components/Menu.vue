<template>
  <div :class="['menu-container', { 'menu-container-newproducts': isNewProducts }]">
    <!-- Menü İkonu (Yatay Üç Çizgi) -->
    <button
      type="button"
      id="buttonMenu"
      class="c-button c-button--menu"
      aria-label="Menüyü görüntüle"
      @mouseover="toggleSidebar"
    >
      <span class="button-text">
        <span class="icon icon-nav-menu">
          <!-- Yatay Üç Çizgi Menü İkonu -->
          <svg role="presentation" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            ></path>
          </svg>
        </span>
        <span class="count"></span>
      </span>
    </button>

    <!-- Menü Paneli -->
    <div :class="['menu-panel', { open: isSidebarVisible }]">
      <div class="menu-panel-header">
        <h2>Menü</h2>
        <button @click="toggleSidebar" class="close-button">Kapat</button>
      </div>
      
      <!-- Cinsiyet Seçimleri -->
      <div class="gender-selection">
        <button
          :class="['gender-button', { selected: selectedCategory === 'men' }]"
          @mouseover="selectCategory('men')"
          @click="navigateToPage('men')"
        >
          Erkek
        </button>
        <button
          :class="['gender-button', { selected: selectedCategory === 'women' }]"
          @mouseover="selectCategory('women')"
          @click="navigateToPage('women')"
        >
          Kadın
        </button>
      </div>

      <!-- Seçilen Kategorinin İçeriği -->
      <div class="menu-panel-content">
        <p v-if="selectedCategory === null">Bir kategori seçin.</p>
        
        <!-- Erkek Kategorisi İçeriği -->
        <div v-if="selectedCategory === 'men'">
          <h3>Erkek Kıyafetleri</h3>
          <ul>
            <li v-for="item in menItems" :key="item" @click="selectItem(item)">{{ item }}</li>
          </ul>
        </div>
        
        <!-- Kadın Kategorisi İçeriği -->
        <div v-if="selectedCategory === 'women'">
          <h3>Kadın Kıyafetleri</h3>
          <ul>
            <li v-for="item in womenItems" :key="item" @click="selectItem(item)">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  isNewProducts?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isNewProducts: false
})

const router = useRouter()

const isSidebarVisible = ref<boolean>(false)
const selectedCategory = ref<'men' | 'women' | null>('men')

const menItems = ['T-Shirt ve Gömlek', 'Jean ve Pantolon', 'Ceket ve Mont', 'Sweatshirt ve Kazak']
const womenItems = ['T-Shirt ve Gömlek', 'Jean ve Pantolon', 'Ceket ve Mont', 'Sweatshirt ve Kazak']

const toggleSidebar = (): void => {
  isSidebarVisible.value = !isSidebarVisible.value
}

const selectCategory = (category: 'men' | 'women'): void => {
  selectedCategory.value = category
}

const selectItem = (item: string): void => {
  toggleSidebar()

  let route = ''
  if (selectedCategory.value === 'men') {
    switch(item) {
      case 'T-Shirt ve Gömlek':
        route = '/Giyim/Men/Tshirts'
        break
      case 'Jean ve Pantolon':
        route = '/Giyim/Men/Jeans'
        break
      case 'Ceket ve Mont':
        route = '/Giyim/Men/Jackets'
        break
      case 'Sweatshirt ve Kazak':
        route = '/Giyim/Men/Sweatshirts'
        break
    }
  } else if (selectedCategory.value === 'women') {
    switch(item) {
      case 'T-Shirt ve Gömlek':
        route = '/Giyim/Women/Tshirts'
        break
      case 'Jean ve Pantolon':
        route = '/Giyim/Women/Jeans'
        break
      case 'Ceket ve Mont':
        route = '/Giyim/Women/Jackets'
        break
      case 'Sweatshirt ve Kazak':
        route = '/Giyim/Women/Sweatshirts'
        break
    }
  }
  
  if (route) {
    router.push(route)
  }
}

const navigateToPage = (category: 'men' | 'women'): void => {
  const route = category === 'men' ? '/Men' : '/Women'
  toggleSidebar()
  router.push(route)
}
</script>

<style scoped>
/* Menü Konteyneri */
.menu-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 0 0 auto;
  position: relative;
  top: 50px;
  z-index: 1000;
}

.menu-container-newproducts {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 0 0 auto;
  position: relative;
  top: -30px;
  z-index: 998;
}

/* Menü İkonu */
#buttonMenu {
  background: none;
  border: none;
  cursor: pointer;
}

.button-text .count {
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
}

/* Menü Paneli */
.menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

/* Mobil Tasarım */
@media screen and (max-width: 768px) {
  .menu-container {
    top: 30px;
    left: 10px;
  }

  .menu-container-newproducts {
    top: -20px;
    left: 10px;
  }

  .menu-panel {
    width: 100%;
  }

  .menu-panel-header {
    padding: 15px;
  }

  .gender-selection {
    flex-direction: column;
    gap: 10px;
  }

  .gender-button {
    width: 100%;
  }

  ul li {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
}

/* Küçük Mobil Cihazlar */
@media screen and (max-width: 480px) {
  .menu-container {
    top: 20px;
    left: 5px;
  }

  .menu-panel-header h2 {
    font-size: 18px;
  }

  .gender-button {
    padding: 8px;
    font-size: 14px;
  }

  ul li {
    font-size: 14px;
  }
}

/* Panel Başlığı */
.menu-panel-header {
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

/* Cinsiyet Seçimleri */
.gender-selection {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.gender-button {
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.gender-button.selected {
  background-color: #4CAF50;
  color: white;
}

/* Menü İçeriği */
.menu-panel-content {
  padding: 20px;
  flex: 1;
}

/* Menü Paneli Açıldığında Görünür Olacak */
.menu-panel.open {
  transform: translateX(0); /* Menü paneli sola kayacak */
}

/* Menü Seçenekleri */
ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  padding: 10px 0;
  cursor: pointer;
}

ul li:hover {
  background-color: #f1f1f1;
  font-weight: bold;
}
</style>
