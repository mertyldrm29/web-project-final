<template>
  <div class="media-container">
    <video 
      v-if="mediaData.videoUrl"
      :src="mediaData.videoUrl" 
      autoplay 
      loop 
      muted 
      playsinline
      style="cursor:pointer" 
      class="video-element"
      @click="navigateTo(mediaData.videoClickUrl)">
    </video>

    <img 
      v-if="mediaData.imageUrl"
      :src="mediaData.imageUrl" 
      class="image-element" 
      style="cursor:pointer"
      alt="Media image"
      @click="navigateTo(mediaData.imageClickUrl)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router'
import { collection, query, getDocs, where, limit, type Firestore, type DocumentData } from 'firebase/firestore'

interface MediaData {
  id?: string;
  videoUrl: string;
  imageUrl: string;
  videoClickUrl: string;
  imageClickUrl: string;
  isActive?: boolean;
}

const router = useRouter()
const mediaData = ref<MediaData>({
  videoUrl: '',
  imageUrl: '',
  videoClickUrl: '',
  imageClickUrl: ''
})

const navigateTo = (url: string): void => {
  if (url) {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }
}

const fetchMediaData = async (): Promise<void> => {
  try {
    console.log('Media verileri yükleniyor...')
    const { $db } = useNuxtApp()
    if (!$db) {
      console.error('Firestore bağlantısı bulunamadı ($db undefined)')
      return
    }

    const mediaRef = collection($db as Firestore, 'media')
    const q = query(
      mediaRef,
      where('isActive', '==', true),
      limit(1)
    )

    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      mediaData.value = {
        id: doc.id,
        ...(doc.data() as Omit<MediaData, 'id'>)
      }
      console.log('Media verileri yüklendi:', mediaData.value)
    }
  } catch (error) {
    console.error('Media verileri yüklenirken hata:', error)
  }
}

onMounted(() => {
  fetchMediaData()
})
</script>

<style scoped>
.media-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100vh;
}

.video-element {
  width: 720px;
  height: 540px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.image-element {
  width: 720px;
  height: 540px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>
