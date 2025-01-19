<template>
    <div class="filter-buttons">
      <button 
        :class="{ active: subTshirt === 'all' }" 
        @click="applyFilter('all')"
      >
        Hepsi
      </button>
      <button 
        :class="{ active: subTshirt === 'tisort' }" 
        @click="applyFilter('tisort')"
      >
        T-Shirt
      </button>
      <button 
        :class="{ active: subTshirt === 'gomlek' }" 
        @click="applyFilter('gomlek')"
      >
        Gömlek
      </button>
      <button 
        :class="{ active: subTshirt === 'grafic' }" 
        @click="applyFilter('grafic')"
      >
        Grafik Baskılı
      </button>
      <button 
        :class="{ active: subTshirt === 'basic' }" 
        @click="applyFilter('basic')"
      >
        Basic
      </button>
      
      
      

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';

  type SubTshirtType = 'all' | 'tisort' | 'gomlek' | 'grafic' | 'basic';

  const subTshirt = ref<SubTshirtType>('all');

  const emit = defineEmits<{
    (e: 'filter-changed', filter: SubTshirtType): void
  }>();

  const applyFilter = (filter: SubTshirtType): void => {
    subTshirt.value = filter;
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
  