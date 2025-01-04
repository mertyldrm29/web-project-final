<template>
  <div class="menu-container">
    <!-- Menü İkonu (Yatay Üç Çizgi) -->
    <button
      type="button"
      id="buttonMenu"
      class="c-button c-button--menu"
      aria-label="Menüyü görüntüle"
      @click="toggleSidebar"
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
          @click="selectCategory('men')"
        >
          Erkek
        </button>
        <button
          :class="['gender-button', { selected: selectedCategory === 'women' }]"
          @click="selectCategory('women')"
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

<script>
export default {
  data() {
    return {
      isSidebarVisible: false, // Menü paneli başlangıçta gizli
      selectedCategory: null,  // Başlangıçta kategori seçili değil
      menItems: ['T-Shirt', 'Pantolon', 'Ceket', 'Şort', 'Ayakkabı'], // Erkek kıyafetleri
      womenItems: ['Elbise', 'Etek', 'Bluz', 'Pantolon', 'Çanta'], // Kadın kıyafetleri
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible; // Menü panelini açma/kapama
    },
    selectCategory(category) {
      this.selectedCategory = category; // Seçilen kategoriyi belirleme
    },
    selectItem(item) {
      alert(`${item} seçildi!`); // Seçilen kıyafetle ilgili işlem yapma
    }
  }
};
</script>

<style scoped>
/* Menü Konteyneri */
.menu-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 0 0 auto;
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
  transform: translateX(-100%); /* Başlangıçta gizli olacak */
  transition: transform 0.3s ease;
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
