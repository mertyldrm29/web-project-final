<template>
    <div class="filter-buttons">
      <button 
        :class="{ active: subJeans === 'all' }" 
        @click="applyFilter('all')"
      >
        Hepsi
      </button>
      <button 
        :class="{ active: subJeans === 'jean' }" 
        @click="applyFilter('jean')"
      >
        Jeans
      </button>
      <button 
        :class="{ active: subJeans === 'pantolon' }" 
        @click="applyFilter('pantolon')"
      >
        Pantolon
      </button>
    
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        subJeans: 'all', // Varsayılan olarak "Tümünü Gör"
      };
    },
    methods: {
      applyFilter(filter4) {
        this.subJeans = filter4;
        this.$emit('filter-changed', filter4); // Parent component'e filtreyi gönderir
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
  