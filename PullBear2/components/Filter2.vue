<template>
    <div class="filter-buttons">
      <button 
        :class="{ active: chosenFilter === 'all' }" 
        @click="applyFilter('all')"
      >
        Hepsi
      </button>
      <button 
        :class="{ active: chosenFilter === 'men' }" 
        @click="applyFilter('men')"
      >
        Erkek
      </button>
      <button 
        :class="{ active: chosenFilter === 'women' }" 
        @click="applyFilter('women')"
      >
        Kadın
      </button>
      

    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        chosenFilter: 'all', // Varsayılan olarak "Tümünü Gör"
      };
    },
    methods: {
      applyFilter(filter2) {
        this.chosenFilter = filter2;
        this.$emit('filter-changed', filter2); // Parent component'e filtreyi gönderir
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
  