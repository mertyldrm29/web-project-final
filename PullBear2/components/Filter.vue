<template>
    <div class="filter-buttons">
      <button 
        :class="{ active: selectedFilter === 'all' }" 
        @click="applyFilter('all')"
      >
        Tümünü Gör
      </button>
      <button 
        :class="{ active: selectedFilter === 'jeans' }" 
        @click="applyFilter('jeans')"
      >
        Jean ve Pantolon
      </button>
      <button 
        :class="{ active: selectedFilter === 'jackets' }" 
        @click="applyFilter('jackets')"
      >
        Ceket ve Mont
      </button>
      <button 
        :class="{ active: selectedFilter === 'sweatshirts' }" 
        @click="applyFilter('sweatshirts')"
      >
        Sweatshirt ve Kazak
      </button>
      <button 
        :class="{ active: selectedFilter === 'tshirts' }" 
        @click="applyFilter('tshirts')"
      >
        T-shirt ve Gömlek
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedFilter: 'all', // Varsayılan olarak "Tümünü Gör"
      };
    },
    methods: {
      applyFilter(filter) {
        this.selectedFilter = filter;
        this.$emit('filter-changed', filter); // Parent component'e filtreyi gönderir
      },
    },
  };
  </script>
  
  <style scoped>
  .filter-buttons {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px;
    border: none;
    cursor: pointer;
    background-color: #f1f1f1;
    font-size: 14px;
    border-radius: 100px;
  }
  
  button.active {
    background-color: #000;
    color: white;
  }
  
 
  </style>
  