<template>
    <div class="filter-buttons">
      <button 
        :class="{ active: subSweatshirts === 'all' }" 
        @click="applyFilter('all')"
      >
        Hepsi
      </button>
      <button 
        :class="{ active: subSweatshirts === 'hoodie' }" 
        @click="applyFilter('hoodie')"
      >
        Kapüşonlu
      </button>
      <button 
        :class="{ active: subSweatshirts === 'nohoodie' }" 
        @click="applyFilter('nohoodie')"
      >
        Kapüşonsuz
      </button>
      <button 
        :class="{ active: subSweatshirts === 'sweatshirt' }" 
        @click="applyFilter('sweatshirt')"
      >
        Sweatshirt
      </button>
      <button 
        :class="{ active: subSweatshirts === 'kazak' }" 
        @click="applyFilter('kazak')"
      >
        Kazak
      </button>
    
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';

  type SubSweatshirtsType = 'all' | 'hoodie' | 'nohoodie' | 'sweatshirt' | 'kazak';

  const subSweatshirts = ref<SubSweatshirtsType>('all');

  const emit = defineEmits<{
    (e: 'filter-changed', filter: SubSweatshirtsType): void
  }>();

  const applyFilter = (filter: SubSweatshirtsType): void => {
    subSweatshirts.value = filter;
    emit('filter-changed', filter);
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
  