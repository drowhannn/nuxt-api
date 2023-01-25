// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {
    API_SECRET_KEY: process.env.API_SECRET_KEY,
    ETHEREAL_EMAIL: process.env.ETHEREAL_EMAIL,
    ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD,
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
