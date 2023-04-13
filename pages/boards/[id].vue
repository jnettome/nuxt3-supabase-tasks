<template>
  <div class="w-full my-[50px]">
    <div class="flex items-center justify-between">
      <h1 class="mb-12 text-6xl font-bold u-text-white">
        {{ board.name }}
      </h1>
      <button
        class="ml-3 text-red-600"
        @click="removeBoard(board)"
      >
        Delete Board
      </button>
    </div>

    <form class="flex gap-2 my-2" @submit.prevent="addColumn">
      <input
        v-model="newColumn"
        class="w-full bg-gray-700 px-3 py-2 outline-0"
        type="text"
        name="newColumn"
        placeholder="Add a column"
        autofocus
        :loading="loadingColumn"
      />
      <button type="submit">
        Add column
      </button>
    </form>

    <div v-if="board.board_columns.length > 0" class="mt-16 border-1 border-gray-50 flex overflow-x-auto">
      <BoardColumnComponent @onTaskClicked="onTaskClicked" @refreshBoard="onRefreshBoard" v-for="column in board.board_columns" :key="column.id" v-bind="column" />
    </div>

    <ModalComponent :show="isShowModal" @onCloseModal="onCloseModal">
      <p class="mb-4">
        {{ modalTask }}
      </p>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { Board } from '~/types/boards'
import { BoardColumn } from '~/types/board_columns'

definePageMeta({
  middleware: 'auth'
})

const isShowModal = ref(false)
const modalTask = ref()

async function onCloseModal () {
  isShowModal.value = false
}

async function onTaskClicked (task: Todo) {
  // console.log('onTaskClicked', task)
  modalTask.value = task
  isShowModal.value = true
  // !isShowModal.value
}

import type { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel: RealtimeChannel

const client = useSupabaseClient()
const user = useSupabaseUser()
const loadingColumn = ref(false)
const newColumn = ref('')


const route = useRoute()
const router = useRouter()

const { data: board, refresh } = await useAsyncData('board', async () => {
  const { data, error } = await client.from<Board>('boards')
    .select('id, name, board_columns(*, todos(*)))')
    .eq('id', route.params.id)
    .eq('user_id', user.value?.id)
    .order('position', { foreignTable: 'board_columns.todos', ascending: true })
    .order('created_at', { foreignTable: 'board_columns.todos', ascending: false })
    .limit(1)
    .single()
  return data
})

// Once page is mounted, listen to changes on the `collaborators` table and refresh collaborators when receiving event
onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = client.channel('public:todos').on(
    'postgres_changes',
    // { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.value?.id}&board_id=eq.${route.params.id}` },
    { event: '*', schema: 'public', table: 'todos', filter: `board_id=eq.${route.params.id}` },
    () => refresh()
  )
  realtimeChannel.subscribe()
  // https://supabase.com/docs/guides/realtime/extensions/postgres-changes#filter-changes
  // https://supabase.com/docs/guides/realtime/extensions/postgres-changes#custom-tokens
})
  // Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  client.removeChannel(realtimeChannel)
})

async function onRefreshBoard () {
  // console.log('onRefreshBoard')
  await refresh()
  // refreshNuxtData()
}

async function addColumn () {
  if (newColumn.value.length === 0) {
    return
  }

  loadingColumn.value = true
  const { error, data } = await client.from<BoardColumn>('board_columns').insert({
    user_id: user.value.id,
    board_id: route.params.id,
    name: newColumn.value,
  }).select('id, name').single()

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  // boards.push(data)
  refresh()

  newColumn.value = ''
  loadingColumn.value = false
}

// async function removeColumn (task: BoardColumn) {
//   const { error } = await client.from<BoardColumn>('board_columns').delete().match({ id: task.id })

//   if (error) {
//     return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
//   }

//   boards.splice(boards.indexOf(task), 1)
// }

async function removeBoard (board: Board) {
  if(!confirm('Are you sure you want to delete this board?')) return;

  const { error } = await client.from<Board>('boards').delete().match({ id: board.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  router.push('/boards')
}
</script>