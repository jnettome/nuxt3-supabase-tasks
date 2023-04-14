<template>
  <div class="w-full my-4">
    <!-- <h1 class="mb-12 text-6xl font-bold u-text-white"> -->
    <h1 class="mb-4 text-6xl font-bold u-text-white">
      Boards
    </h1>
    <form class="flex gap-2 my-2" @submit.prevent="addBoard">
      <input
        v-model="boardName"
        class="w-full bg-gray-700 px-3 py-2 outline-0"
        type="text"
        name="boardName"
        placeholder="Name your board here"
        autofocus
        :loading="loading"
      />
      <button type="submit">
        Create
      </button>
    </form>

    <div v-if="boards.length > 0" class="mt-12">
      <ul>
        <li
          v-for="(task, index) of boards"
          :key="`task${index}`"
        >
          <NuxtLink :to="`/boards/${task.id}`" class="block text-2xl font-medium border-gray-200 divide-y divide-gray-200 px-6 py-2 card bg-gray-600 mb-4">
            {{task.name}}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Board } from '~/types/boards'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'boards',
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const boardName = ref('')

const { data: { value: { data: boards } }, refresh } = await useAsyncData('boards', async () => {
  return await client.from<Board>('boards')
    .select('id, name')
    .eq('user_id', user.value?.id)
})

async function addBoard () {
  if (boardName.value.length === 0) {
    return
  }

  loading.value = true
  const { data, error } = await client.from<Board>('boards').insert({
    user_id: user.value.id,
    name: boardName.value,
  }).select('id, name').single()

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  boards.push(data)
  // refresh()

  boardName.value = ''
  loading.value = false
}
</script>