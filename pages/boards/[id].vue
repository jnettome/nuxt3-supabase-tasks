<template>
  <div class="w-full my-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div v-if="!isEditing">
          <h1 class="mb-4 text-6xl font-bold u-text-white">
            {{ board.name }}
          </h1>
        </div>
        <div v-show="isEditing">
          <form class="flex items-center" @submit.prevent="updateBoard(form)">
            <input
              class="dark:bg-zinc-600 dark:text-gray-100 bg-slate-200 p-2 font-semibold mb-4 text-xl font-bold outline-0"
              type="text"
              name="name"
              ref="nameInput"
              :disabled="isEditingLoading"
              placeholder="Add board name"
              @keydown.esc="toggleEditing"
              v-model="form.name">
            <button type="submit" class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-400 dark:hover:text-gray-300 hover:dark:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </button>
          </form>
        </div>

        <div class="flex items-center">
          <button @click="toggleEditing" class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-400 dark:hover:text-gray-300 hover:dark:bg-gray-800">
            <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>

          <button
            v-if="isEditing"
            class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:dark:text-red-300 hover:text-red-700 hover:dark:bg-red-800 hover:bg-red-300"
            @click="removeBoard(board)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    

    <div class="mt-4 border-1 border-gray-50 flex overflow-x-scroll">
      <BoardColumnComponent @onTaskClicked="onTaskClicked" @refreshBoard="onRefreshBoard" v-for="column in board.board_columns" :key="column.id" v-bind="column" />

      <div class="rounded-lg flex items-start dark:bg-zinc-900 min-h-16 mr-4 text-center md:min-w-[150px] w-[150px]">
        <button @click="addNewColumn" class="text-gray-700 hover:text-gray-500 mt-4 p-4">
          Click here to add a new column
        </button>
      </div>
    </div>
    <div v-if="false" class="rounded-lg dark:bg-zinc-900 min-h-16 mr-4 w-full min-w-full md:min-w-0 md:w-1/4 lg:max-w-sm">
        <button @click="isShowNewColumn = !isShowNewColumn">
          Add column
        </button>
        <div class="flex items-center">
          <form v-if="isShowNewColumn" class="flex gap-2 my-2" @submit.prevent="addColumn">
            <input
              v-model="newColumn"
              class="w-full dark:bg-gray-700 px-3 py-2 outline-0"
              type="text"
              name="newColumn"
              placeholder="Add a column"
              :loading="loadingColumn"
            />
              <!-- autofocus -->
            <button type="submit">
              Add column
            </button>
          </form>
        
        </div>
      </div>

    <ModalComponent :show="isShowModal" @onCloseModal="onCloseModal">

      <!-- this needs to go to separate components: one for editing, one for display -->

      <!-- text-slate-700 bg-slate-300 hover:text-gray-200 hover:bg-slate-400 hover:dark:text-gray-200 dark:text-gray-300 dark:bg-slate-800 hover:dark:bg-slate-950 -->

      <div class="flex">
        <button class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950" @click.stop.prevent="isEditing = !isEditing">
          <span v-if="isEditing">cancel editing</span>
          <span v-else>edit task</span>
        </button>
        <button v-if="isEditing" @click.stop.prevent="deleteTask(modalTask)" class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
          delete task
        </button>

      </div>


      <div v-if="isEditing">
        
        <form @submit.prevent="updateTask(modalTask)">
          <input
            v-model="modalTask.task"
            class="w-full dark:bg-gray-700 px-3 py-2 outline-0"
            type="text"
            name="task"
            placeholder="Task title"
            :disabled="isLoading"
          />
          <textarea
            v-model="modalTask.body"
            class="w-full dark:bg-gray-700 px-3 py-2 outline-0 mt-2 h-[200px]"
            type="text"
            name="body"
            placeholder="Add more details"
            :disabled="isLoading"
            @keydown.ctrl.enter="updateTask(modalTask)"
            @keydown.meta.enter="updateTask(modalTask)"
          />
          <button type="submit" class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
            Update task
          </button>
        </form>
      </div>
      
      <div v-else>
        <!-- viewing -->
        <div class="flex mt-4 justify-between">
          <h1>{{ modalTask.task }}</h1>
          <p class="w-[100px]">#{{ modalTask.id }}</p>
        </div>

        <div>
          <MarkdownComponent :block="{ content: modalTask.body }">
          </MarkdownComponent>
        </div>

        <span class="text-sm text-gray-600 truncate">{{ $dayjs(modalTask.created_at).format('D MMM LT') }}</span>
        
        <!-- <p>{{ modalTask.is_complete ? 'done' : '' }}</p> -->
        <!-- <p>#{{ modalTask.position }}</p> -->
        <!-- <p>#{{ modalTask.board_id }}</p> -->
        <!-- <p>#{{ modalTask.board_column_id }}</p> -->
        <!-- <p class="mb-4">
          {{ modalTask }}
        </p> -->
      </div>

    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { Board } from '~/types/boards'
import { BoardColumn } from '~/types/board_columns'

definePageMeta({
  middleware: 'auth'
})

const isEditing = ref(false)
const isEditingLoading = ref(false)
const isLoading = ref(false)
const nameInput = ref()

async function toggleEditing () {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    isEditingLoading.value = false
    setTimeout(() => {
      nameInput.value?.focus()
    }, 100)
  }
}

const isShowModal = ref(false)
const isShowNewColumn = ref(false)
const modalTask = ref({
  id: 0,
  task: '',
  body: '',
  is_complete: false,
  position: 0,
  board_id: 0,
  board_column_id: 0,
  created_at: '',
  updated_at: ''
})

async function onCloseModal () {
  isShowModal.value = false
}

async function onTaskClicked (task: Todo) {
  // console.log('onTaskClicked', task)
  modalTask.value = task
  isShowModal.value = true
  isEditing.value = false
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
    .order('created_at', { foreignTable: 'board_columns', ascending: true })
    .order('position', { foreignTable: 'board_columns.todos', ascending: true })
    .order('created_at', { foreignTable: 'board_columns.todos', ascending: false })
    .limit(1)
    .single()
  return data
})

const form = ref({
  name: board.value?.name || '',
  id: board.value?.id || 0
})

async function updateBoard (params: any) {
  const { error } = await client.from<Board>('boards').update({ name: params.name }).match({ id: params.id })

  if (error) {
    isEditingLoading.value = false
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  isEditing.value = false
  isEditingLoading.value = true

  refresh()

  // emit('refreshBoard')
  
  // isEditingLoading.value = true
  // const { data, error } = await client.from<Board>('boards')
  //   .update({ name: params.name })
  //   .eq('id', params.id)
  //   .eq('user_id', user.value?.id)
  // if (error) {
  //   isEditingLoading.value = true
  //   console.log('error', error)
  // }
  // if (data) {
  //   console.log('data', data)
  //   refresh()
  // }

  // isEditing.value = false
  // isEditingLoading.value = false
}



useHead({
  title: () => board.value?.name || 'Board',
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

async function addNewColumn () {
  loadingColumn.value = true
  const { error, data } = await client.from<BoardColumn>('board_columns').insert({
    user_id: user.value.id,
    board_id: route.params.id,
    name: 'Unnamed column',
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

async function updateTask (task: Todo) {
  isLoading.value = true
  const { error } = await client.from<Todo>('todos').update({ 
    task: task.task,
    body: task.body,
  }).match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  isLoading.value = false
  isEditing.value = false
  // boards.splice(boards.indexOf(task), 1)
}

async function deleteTask (params: any) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  const { error } = await client.from<Todo>('todos').delete().match({ id: params.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  isLoading.value = false
  isEditing.value = false

  onCloseModal()
  // boards.splice(boards.indexOf(task), 1)
  
}

async function removeBoard (board: Board) {
  if(!confirm('Are you sure you want to delete this board?')) return;

  const { error } = await client.from<Board>('boards').delete().match({ id: board.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  router.push('/boards')
}
</script>