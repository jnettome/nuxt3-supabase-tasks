<template>
  <div class="w-full my-[50px]">
    <h1 class="mb-12 text-6xl font-bold u-text-white">
      {{ board.name }}
    </h1>
    <form class="flex gap-2 my-2" @submit.prevent="addColumn">
      <input
        v-model="newTask"
        class="w-full"
        size="xl"
        variant="white"
        type="text"
        name="newTask"
        placeholder="Add a column"
        autofocus
        :loading="loading"
      />
      <button type="submit" variant="white">
        Add
      </button>
    </form>

    <div v-if="boards.length > 0" body-class="px-6 py-2 card">
      <BoardColumnComponent v-for="column in boards" :key="column.id" v-bind="column" />

      <ul>
        <!-- :class="{ 'border-b': index !== tasks.length - 1 }" -->
        <li
          v-for="(task, index) of boards"
          :key="`task${index}`"
          class="border-gray-200 divide-y divide-gray-200"
        >
          <div class="py-2">
            <label :label-class="`block font-medium u-text-gray-700`" wrapper-class="flex items-center justify-between w-full" :name="`task${index}`">
              {{task.name}}
              <div class="flex items-center justify-between">
                <button
                  class="ml-3 text-red-600"
                  size="sm"
                  variant="transparent"
                  icon="heroicons-outline:trash"
                  @click="removeColumn(task)"
                >
                  Remove
                </button>
              </div>
            </label>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Board } from '~/types/boards'
import { BoardColumn } from '~/types/board_columns'

definePageMeta({
  middleware: 'auth'
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const newTask = ref('')

const route = useRoute()

// const { data: { value: { data: board } }, refresh } = await useAsyncData('board', async () => {
//   return await client.from<Board>('boards')
//     .select('id, name')
//     .eq('id', route.params.id)
//     .eq('user_id', user.value?.id)
//     .limit(1)
//     .single()
// })
const { data: { value: { data: board } }, refresh } = await useAsyncData('board', async () => {
  return await client.from<Board>('boards')
    .select('id, name')
    .eq('id', route.params.id)
    .eq('user_id', user.value?.id)
    .limit(1)
    .single()
})

const { data: { value: { data: boards } }, refreshColumns } = await useAsyncData('board_columns', async () => {
  return await client.from<BoardColumn>('board_columns')
    .select('id, name, todos(*)')
    .eq('board_id', route.params.id)
    .eq('user_id', user.value?.id)
})

// const { data: restaurant } = await useAsyncData('boards', async () => {
//   const { data } = await client.from('restaurants').select('name, location').eq('name', 'My Restaurant Name').single()
//   return data
// })

async function addColumn () {
  if (newTask.value.length === 0) {
    return
  }

  loading.value = true
  const { error, data } = await client.from<BoardColumn>('board_columns').upsert({
    user_id: user.value.id,
    board_id: route.params.id,
    name: newTask.value,
  })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  // boards.push(data[0])
  // refresh()

  newTask.value = ''
  loading.value = false
}

async function removeColumn (task: BoardColumn) {
  const { error } = await client.from<BoardColumn>('board_columns').delete().match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  boards.splice(boards.indexOf(task), 1)
}
</script>