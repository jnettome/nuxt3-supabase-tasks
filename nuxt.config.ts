// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1, minimum-scale=1',
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'en'
      },
      {
        code: 'pt',
        name: 'ptbr'
      }
    ],
    strategy: 'prefix_except_default', // https://i18n.nuxtjs.org/options-reference#strategy
    defaultLocale: 'en',
    // detectBrowserLanguage: {
      // useCookie: true,
      // cookieKey: 'i18n_redirected_tarefas',
      // redirectOn: 'root',  // recommended
    // }
  },
  colorMode: {
    classSuffix: ''
  },
  googleFonts: {
    families: {
      Rubik: true,
      Roboto: true,
      Lato: true,
      // 'Josefin+Sans': true,
      // Lato: [100, 300],
      // Raleway: {
      //   wght: [100, 400],
      //   ital: [100]
      // },
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})
