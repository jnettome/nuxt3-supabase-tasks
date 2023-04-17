<template>
  <!-- bg-slate-300 dark:bg-gray-950 -->
  <div :class="appClasses">
    <header class="px-4 lg:px-6 py-2.5">
      <div class="flex flex-wrap justify-between items-center mx-auto">
        <NuxtLink to="/boards">tarefas.me</NuxtLink>
        <div class="flex items-center justify-between">
          <button @click="toggleDark" class="p-2 mr-4">
            <svg v-if="colorMode.preference === 'light'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
              <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-alt-high-fill" viewBox="0 0 16 16">
              <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm8 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm-13.5.5a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1h2zm11.157-6.157a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.9 2.121a.5.5 0 0 0 .707-.707L3.05 5.343a.5.5 0 1 0-.707.707l1.414 1.414zM8 7a4 4 0 0 0-4 4 .5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5 4 4 0 0 0-4-4z"/>
            </svg>
          </button>

          <!-- <NuxtLink class="p-2 mr-4 cursor-pointer" v-for="locale in availableLocales" :key="locale.code" @click="switchLocale(locale.code)">{{ locale.name }}</NuxtLink> -->
          
          <button v-if="!!user" class="u-text-white" size="xl" variant="transparent" @click="logout">
            {{ $t('logout') }}
          </button>
        </div>
      </div>
    </header>
    <div class=" min-h-screen px-4 mx-auto">
      <div class="min-h-screen flex justify-center">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const route = useRoute()

const classesForHome = 'main-app backdrop-blur-xl min-h-screen text-slate-900 dark:text-slate-50'
const classesForApp = 'bg-slate-300 dark:bg-gray-950 min-h-screen text-slate-900 dark:text-slate-50'

const appClasses = computed(() => {
  return route.path === '/' ? classesForHome : classesForApp
})

// const { locale, locales, setLocale } = useI18n()
// const { locale, locales, setLocale } = useNuxtApp().$i18n
// const switchLocalePath = useSwitchLocalePath()
// const { i18n } = useNuxtApp()

const switchLocale = (code: string) => {
  // locale.value = code
  // alert(code)
  // useNuxtApp().$toast(code)
  // console.log(useNuxtApp().$i18n.locale)
  // console.log(useNuxtApp().i18n)
  // .setLocale(code)
  // i18n.setLocale(code)
}
const locales = ref([
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' }
])
const locale = ref('en')
// const locales = [{ code: 'en', name: 'English' }, { code: 'pt', name: 'Português' }]
const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
useHead({
  // title: 'home',
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | tarefas.me` : 'tarefas.me';
  },
  meta: [
    { name: 'description', content: 'a dead simple trello like task manager' },
    { name: "msapplication-TileColor", content: "#000000" },
    { name: "theme-color", content: "#000000" }
  ],
  link: [
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#000000" }
  ],
  bodyAttrs: {
    // class: 'test'
  },
  // script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})

const logout = async () => {
  await client.auth.signOut()
  document.location.href = '/'
}
</script>