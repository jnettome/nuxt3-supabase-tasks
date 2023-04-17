<template>
  <div class="min-h-full flex flex-col sm:px-6 lg:px-8">
    <!-- <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      {{ $t('index.title') }}
    </h2> -->

    <header class="text-center p-3 mb-10 mt-10">
      <h1 class="my-6 text-center text-6xl max-w-screen-sm font-black block mx-auto mb-10">
        Complete your tasks and get you job done
      </h1>
      <h3 class="text-xl font-bold block">
        A simple and easy to use task manager. It's free and open source.
      </h3>
    </header>
<!-- Continue with GitHub -->

<!-- c 2023 Loco Guide / Changelog / Pricing / Terms / Status / Twitter / Github -->

<!-- Keyboard-first design
Optimized for efficiency with shortcuts for everything. -->
<!-- Board
Manage your issues in a real-time automated kanban board with a drag and drop interface.

Learn more →
List
Browse your issues and group them by labels, assignees, milestones, and more.

Learn more →
Timeline
Plan your issues by scheduling milestones and see the progress in a timeline.

Learn more →
Atinux


Desktop Application
Install Volta on your desktop for a native experience with better notifications.
Mobile Ready
Take advantage of our PWA to use Volta on your mobile or tablet devices.
Browser Extension
Sync notifications, update issue status or jump to a Volta repo / issue from GitHub. -->

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="dark:bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <form @submit.stop.prevent="login">
            <input v-model="email" class="w-full font-bold dark:bg-zinc-700 px-3 py-2 outline-0 border-b border-gray-500 mb-4" type="email" :placeholder="$t('index.your_email_address')" autofocus />
            <button
              class="px-3 py-2 rounded text-sm w-full font-semibold bg-gray-600 dark:bg-slate-800 text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950"
              :disabled="loading"
              type="submit"
            >
              <span v-if="!loading">{{ $t('index.send_me_a_login_link') }}</span>
              <span v-else>{{ $t('index.please_wait') }}</span>
            </button>
          </form>
        </div>

        <div v-else>
          <p class="text-center">
            {{ $t('index.email_sent') }}
          </p>
        </div>
      </div>
    </div>

    <div class="imgpreview flex justify-center mt-12">
      <img class="w-full lg:max-w-screen-xl preview light" src="/bgs/prelight.png" alt="">
      <img class="w-full lg:max-w-screen-xl preview dark" src="/bgs/predark.png" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()

const loading = ref(false)
const emailSent = ref(false)
const email = ref()

watchEffect(() => {
  if (user.value) {
    router.push('/boards')
  }
})

useHead({
  title: 'login',
  bodyAttrs: {
    class: 'with-bg'
  },
})

const login = async (provider: string) => {
  loading.value = true

  const { error, data } = await client.auth.signInWithOtp({ email: email.value })

  if (error) {
    useNuxtApp().$toast.error(JSON.stringify(error))
  }

  loading.value = false

  emailSent.value = true
}
</script>