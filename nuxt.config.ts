export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  runtimeConfig: {
    openAiApiKey: 'some-key',
    public: {
      someValue: 'on the frontend!',
    },
  },
});
