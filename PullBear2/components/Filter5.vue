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
  
  <script setup lang="ts">
  import { ref } from 'vue';

  type SubJacketsType = 'all' | 'ceket' | 'mont' | 'kaban';

  const subJackets = ref<SubJacketsType>('all');

  const emit = defineEmits<{
    (e: 'filter-changed', filter: SubJacketsType): void
  }>();

  const applyFilter = (filter: SubJacketsType): void => {
    subJackets.value = filter;
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
  