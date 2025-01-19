// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true,

  css: [
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],

  devtools: { enabled: true },

  plugins: [
    '~/plugins/firebase.ts'
  ],

  // Firebase client-side only
  ssr: false,

  modules: [
    '@pinia/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: true
  },

  compatibilityDate: '2025-01-19'
})