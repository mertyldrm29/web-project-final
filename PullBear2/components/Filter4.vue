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
  
  <script setup lang="ts">
  import { ref } from 'vue';

  type SubJeansType = 'all' | 'jean' | 'pantolon';

  const subJeans = ref<SubJeansType>('all');

  const emit = defineEmits<{
    (e: 'filter-changed', filter: SubJeansType): void
  }>();

  const applyFilter = (filter: SubJeansType): void => {
    subJeans.value = filter;
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
  