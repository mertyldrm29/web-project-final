// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components:true,
  css: [
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],
  
  devtools: { enabled: true },
  plugins: [
    '~/plugins/firebase.js'
  ],
  ssr: false // Firebase client-side only
})
