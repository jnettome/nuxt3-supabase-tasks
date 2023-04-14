<template>
  <div class="w-full my-4">
    <!-- <h1 class="mb-12 text-6xl font-bold u-text-white"> -->
    <h1 class="mb-4 text-6xl font-bold u-text-white">
      Boards
    </h1>
    <form v-if="false" class="flex gap-2 my-2" @submit.prevent="addBoard">
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
          <!-- block text-2xl font-medium border-gray-200 divide-y divide-gray-200 px-6 py-2 card bg-gray-600 mb-4 -->
          <NuxtLink :to="`/boards/${task.id}`" class="text-6xl pt-6 pb-2 mb-4 flex w-100 font-medium hover:bg-zinc-900 hover:px-10 transition border-b border-gray-800">
            {{task.name}}
          </NuxtLink>
        </li>
        <li class="mt-16">
          <!-- block w-100 text-2xl font-medium border-gray-200 divide-y divide-gray-200 px-6 py-2 card bg-gray-600 mb-4 -->
          <!-- <button @click="createNewBoard" class="text-gray-700 hover:text-gray-500 mt-4 p-4"> -->
          <button @click="createNewBoard" class="text-gray-700 hover:text-gray-500 mt-4 p-4 rounded-lg flex bg-zinc-900 min-h-20 items-center mr-4 text-center">
            Create new board
          </button>
          
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

const router = useRouter()

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

async function createNewBoard () {
  loading.value = true
  const { data, error } = await client.from<Board>('boards').insert({
    user_id: user.value.id,
    name: 'My new board 🎉',
  }).select('id, name').single()

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  boards.push(data)

  // refresh()

  boardName.value = ''
  loading.value = false

  router.push(`/boards/${data.id}`)
}
</script>