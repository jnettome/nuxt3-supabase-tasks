<template>
  <div class="min-h-full flex flex-col sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      Sign in or create your account
    </h2>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <form @submit.stop.prevent="login">
            <input v-model="email" class="w-full font-bold bg-zinc-700 px-3 py-2 outline-0 border-b border-gray-500 mb-4" type="email" placeholder="Your email address" autofocus />
            <button
              class="px-3 py-2 rounded text-sm w-full font-semibold bg-slate-800 text-gray-300 hover:text-gray-200 hover:bg-slate-950"
              :disabled="loading"
              type="submit"
            >
              <span v-if="!loading">send me a login link</span>
              <span v-else>please wait...</span>
            </button>
          </form>
        </div>

        <div v-else>
          <p class="text-center">
            We've sent you an email with a link to sign in.
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
    alert(error)
  }

  loading.value = false

  emailSent.value = true
}
</script>