<template>
  <div class="media-container">

    <video 
      src="@/video/video.mp4" 
      autoplay 
      loop 
      muted 
      playsinline
      style="cursor:pointer" 
      class="video-element">
      
    </video>

    <img 
      src="@/video/photo.png" 
      class="image-element" 
      style="cursor:pointer"
      />

  </div>
</template>

<script>
export default {
  name: "Video",
};
</script>

<style scoped>
.media-container {
  display: flex;
  justify-content: center; /* Yatayda merkeze hizala */
  align-items: center;    /* Dikeyde merkeze hizala */
  gap: 20px;              /* Video ve fotoğraf arasındaki boşluk */
  height: 100vh;          /* Tüm ekran yüksekliği */
}

.video-element {
  width: 720px;
  height: 540px;
  object-fit: cover; /* Video oranlarını koruyarak boyutlandır */
  border: 1px solid #ddd; /* Video etrafında ince bir çerçeve */
  border-radius: 10px;    /* Kenarları yuvarlatılmış çerçeve */
}

.image-element {
  width: 720px;
  height: 540px;
  object-fit: cover; /* Fotoğraf oranlarını koruyarak boyutlandır */
  border: 1px solid #ddd; /* Fotoğraf etrafında ince bir çerçeve */
  border-radius: 10px;    /* Kenarları yuvarlatılmış çerçeve */
}
</style>
