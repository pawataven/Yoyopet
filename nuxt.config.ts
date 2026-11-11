import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/a11y', '@nuxt/fonts', '@nuxt/eslint', '@nuxt/image'],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'th' },
      title: 'YoyoPet',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: ''
    }
  },

  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [tailwindcss()]
  },

  typescript: {
    strict: true
  }
})
