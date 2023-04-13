<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      Sign in to your account
    </h2>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="u-bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 u-bg-white text-gray-500"> Connect with </span>
            </div>
          </div>

          <input v-model="email" class="u-input" type="email" placeholder="Email" />

          <button
            class="mt-3"
            icon="mdi:github"
            block
            label="Github"
            variant="black"
            :loading="loading"
            @click="login()"
          >entrar</button>

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