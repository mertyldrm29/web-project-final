<template>
    <div class="filter-buttons">
      <button 
        :class="{ active: subJackets === 'all' }" 
        @click="applyFilter('all')"
      >
        Hepsi
      </button>
      <button 
        :class="{ active: subJackets === 'ceket' }" 
        @click="applyFilter('ceket')"
      >
        Ceket
      </button>
      <button 
        :class="{ active: subJackets === 'mont' }" 
        @click="applyFilter('mont')"
      >
        Mont
      </button>
      <button 
        :class="{ active: subJackets === 'kaban' }" 
        @click="applyFilter('kaban')"
      >
        Kaban
      </button>
    
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        subJackets: 'all', // Varsayılan olarak "Tümünü Gör"
      };
    },
    methods: {
      applyFilter(filter5) {
        this.subJackets = filter5;
        this.$emit('filter-changed', filter5); // Parent component'e filtreyi gönderir
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
  