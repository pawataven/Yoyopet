import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/a11y', '@nuxt/fonts', '@nuxt/eslint', '@nuxt/image', '@nuxt/icon'],

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

  components: [{ path: '~/components', pathPrefix: false }],

  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [tailwindcss()]
  },

  typescript: {
    strict: true
  },

  fonts: {
    families: [
      { name: 'Anuphan', provider: 'google', weights: [400, 500, 600], subsets: ['thai', 'latin'], global: true },
      { name: 'Mitr', provider: 'google', weights: [500], subsets: ['thai', 'latin'], global: true },
      { name: 'Fredoka', provider: 'google', weights: [600], subsets: ['latin'], global: true }
    ]
  },

  icon: {
    serverBundle: { collections: ['lucide'] },
    // Unlayered icon CSS would override Tailwind's `size-*` utilities
    cssLayer: 'base'
  }
})
