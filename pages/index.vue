<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      Sign in to your account
    </h2>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-gray-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <form @submit.stop.prevent="login">
            <input v-model="email" class="w-full bg-gray-700 px-3 py-2 outline-0 border-b" type="email" placeholder="Email" autofocus />
            <button
              class="ml-3"
              :disabled="loading"
              type="submit"
            >
              entrar
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