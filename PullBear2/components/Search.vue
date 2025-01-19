<template>
  <div class="search-section">
    <div :class="['search-container', { 'index-search': isIndex, 'jeans-search': isJeans, 'newproducts-search': isNewProducts }]">
      <input
        type="text"
        class="search-input"
        placeholder="Ara"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isIndex?: boolean
  isJeans?: boolean
  isNewProducts?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isIndex: false,
  isJeans: false,
  isNewProducts: false
})

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref<string>('')

const handleSearch = (): void => {
  if (!searchQuery.value.trim()) return

  if (searchQuery.value.trim().length < 3) {
    alert('Aramak için en az 3 harf giriniz.')
    return
  }

  emit('search', searchQuery.value.trim())
}
</script>

<style scoped>
.search-section {
  position: relative;
  z-index: 1000;
}

.search-container {
  display: flex;
  align-items: center;
  padding: 5px;
  width: 200px;
  position: absolute;
}

.search-container.index-search {
  position: absolute !important;
  right: 250px !important;
  top: 15px !important;
  padding: 5px !important;
}

.search-container.jeans-search {
  position: absolute !important;
  right: 250px !important;
  top: 0px !important;
  padding: 5px !important;
}

.search-container.newproducts-search {
  position: absolute !important;
  right: 250px !important;
  top: -60px !important;
  padding: 5px !important;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 50px;
  outline: none;
  width: 100%;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  width: 200px;
  border-color: #007bff;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 5px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-button .icon {
  width: 20px;
  height: 20px;
  color: white;
}

.search-button:hover {
  background: #2e2e2e;
}
</style>
  