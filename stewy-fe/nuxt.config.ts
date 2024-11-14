export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-quasar-ui",
    "@pinia/nuxt",
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
  ],

  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    originEnvKey: "AUTH_ORIGIN",
    baseURL: "http://localhost:3000/api/auth",
    provider: {},
    sessionRefresh: {
      enablePeriodically: false,
      enableOnWindowFocus: true,
    },
  },

  plugins: ["~/plugins/error-handler.js"],

  nitro: {
    plugins: [],
  },

  quasar: {
    plugins: ["Notify"],
  },

  compatibilityDate: "2024-11-08",
});