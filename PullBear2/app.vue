<template>
  <div>
    <!-- Mobil Layout -->
    <MobileLayout v-if="isMobile">
      <NuxtPage />
    </MobileLayout>

    <!-- Desktop Layout -->
    <div v-else>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref<boolean>(false)

const checkMobile = (): void => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
  