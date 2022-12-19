// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {
    API_SECRET_KEY: process.env.API_SECRET_KEY,
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
