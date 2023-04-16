<template>
  <div class="min-h-full flex flex-col sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      {{ $t('index.title') }}
    </h2>

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