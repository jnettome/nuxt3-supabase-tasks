<template>
  <div class="w-full my-[50px]">
    <h1 class="mb-12 text-6xl font-bold u-text-white">
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
      <button type="submit" variant="white">
        Create
      </button>
    </form>

    <div v-if="boards.length > 0" class="mt-12">
      <ul>
        <!-- :class="{ 'border-b': index !== tasks.length - 1 }" -->
        <li
          v-for="(task, index) of boards"
          :key="`task${index}`"
        >
          <NuxtLink :to="`/boards/${task.id}`" class="block text-2xl font-medium border-gray-200 divide-y divide-gray-200 px-6 py-2 card bg-gray-600 mb-4">
            {{task.name}}
          </NuxtLink>
            <!-- <div class="flex items-center justify-between">
              <button
                class="ml-3 text-red-600"
                size="sm"
                variant="transparent"
                icon="heroicons-outline:trash"
                @click="removeTask(task)"
              >
                Remove
              </button>
            </div> -->
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

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const boardName = ref('')

// { data: tasks }
// const { data: { value: tasks } } = await useAsyncData('boards', async () => {
const { data: { value: { data: boards } }, refresh } = await useAsyncData('boards', async () => {
  return await client.from<Board>('boards')
    .select('id, name')
    .eq('user_id', user.value?.id)
})

// const { data: restaurant } = await useAsyncData('boards', async () => {
//   const { data } = await client.from('restaurants').select('name, location').eq('name', 'My Restaurant Name').single()
//   return data
// })

async function addBoard () {
  if (boardName.value.length === 0) {
    return
  }

  loading.value = true
  const { error, data } = await client.from<Board>('boards').upsert({
    user_id: user.value.id,
    name: boardName.value,
  })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  // boards.push(data[0])
  // refresh()

  boardName.value = ''
  loading.value = false
}

async function removeTask (task: Board) {
  const { error } = await client.from<Board>('boards').delete().match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  boards.splice(boards.indexOf(task), 1)
}
</script>