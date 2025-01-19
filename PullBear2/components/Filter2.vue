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
  
  <script setup lang="ts">
  import { ref } from 'vue';

  type FilterType = 'all' | 'men' | 'women';

  const chosenFilter = ref<FilterType>('all');

  const emit = defineEmits<{
    (e: 'filter-changed', filter: FilterType): void
  }>();

  const applyFilter = (filter: FilterType): void => {
    chosenFilter.value = filter;
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
  