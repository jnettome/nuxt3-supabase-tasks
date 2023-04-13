<template>
  <div class="bg-zinc-800 min-h-16 mr-4 w-full min-w-full md:min-w-0 md:w-1/4 lg:max-w-sm">
    <header class="flex items-center justify-between p-2 border-b border-gray-500 mb-4">
      <h3 class="font-medium">{{ name }} {{ id }}</h3>

      <button
        class="ml-3 text-red-200"
        @click="removeColumn(id)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
        </svg>
      </button>
    </header>

    <form class="flex px-2 gap-2 my-2" @submit.prevent="addTask">
      <input
        v-model="newTask"
        class="w-full bg-gray-700 px-3 py-2 outline-0"
        type="text"
        name="newTask"
        placeholder="Add a task"
        autofocus
        :loading="loading"
      />
    </form>

    <!-- {{ drag }} -->
    <!-- v-if="todos.length > 0" -->

    <div body-class="px-6 py-2">
      <draggable style="min-height: 100vh" item-key="position" v-model="itemsDraggable" @start="drag=true" @end="drag=false" group="people">
        <template #item="{ element }">
          <div @click="toggleModal(element)" class="my-4 mx-2 p-2 bg-zinc-950">{{ element.task }}</div>
        </template>
      </draggable>
        <!-- <div class="flex items-center justify-between">
          <input
            type="checkbox"
            :checked="task.is_complete"
            @change="updateTask(task)"
          />
          <span>{{ task.task }}</span>
          <button
            class="ml-3 text-red-600"
            @click="removeTask(task)"
          >
            Remove
          </button>
        </div> -->
        
      <!-- </div> -->
    </div>
    
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

// set props
const column = defineProps<{
  id: number,
  name: string,
  todos: Array<{id: number, task: string, board_id: number, board_column_id: number, position: number, is_complete: boolean, created_at: string }>
}>()

const emit = defineEmits<{
  (event: 'refreshBoard'): void,
  (event: 'onTaskClicked', task: Todo): void
}>()

import { BoardColumn } from '~/types/board_columns'
import { Todo } from '~/types/todos'

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const newTask = ref('')
const route = useRoute()

const drag = ref(false)
const itemsDraggable = computed({
  get() {
    return column.todos
  },
  set(newValue) {
    // aqui ele chega uma array com todos os elementos na nova ordem
    // console.log(newValue)
    updateTaskPositionInSupabase(newValue)
    updateTaskBoardColumnInSupabase(newValue)
  }
})

async function toggleModal(task: Todo) {
  emit('onTaskClicked', task)
}

async function addTask () {
  if (newTask.value.length === 0) {
    return
  }

  loading.value = true
  const { error, data } = await client.from<Todo>('todos').insert({
    user_id: user.value.id,
    task: newTask.value,
    is_complete: false,
    board_column_id: column.id,
    board_id: route.params.id
    // position?: number;
    // user_id?: string;
    // user?: string;
  }).select('*').single()

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  newTask.value = ''
  loading.value = false

  emit('refreshBoard')
}

async function updateTask (task: Todo) {
  const { error } = await client.from<Todo>('todos').update({ is_complete: task.is_complete }).match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  emit('refreshBoard')
}

async function updateTaskPosition (taskId: number, position: number) {
  loading.value = true
  const { error } = await client.from<Todo>('todos').update({ position: position }).match({ id: taskId })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  emit('refreshBoard')
  loading.value = false
}

async function updateTaskBoardColumn (taskId: number, boardColumnId: number) {
  loading.value = true
  const { error } = await client.from<Todo>('todos').update({ board_column_id: boardColumnId }).match({ id: taskId })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  emit('refreshBoard')
  loading.value = false
}


async function updateTaskPositionInSupabase (value: Array) {
  loading.value = true

  const payload = value.map((item: any, index: number) => ({ id: item.id, position: index }))
  const { data, error } = await client.rpc('update_todos_order', { payload });
  
  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  loading.value = false
}

async function updateTaskBoardColumnInSupabase (newValue: Array) {
  if (column.todos.length === newValue.length)
    return

  // find added cards that weren't on the original todos array before
  const newColumn = newValue.filter(x => !column.todos.includes(x));
  if (newColumn.length > 0) {
    console.log('new todo added', newColumn)

    updateTaskBoardColumn(newColumn[0].id, column.id)
  }
}   

async function removeTask (task: Todo) {
  const { error } = await client.from<Todo>('todos').delete().match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  // tasks.splice(tasks.indexOf(task), 1)
  emit('refreshBoard')
}

async function removeColumn (boardColumnId: number) {
  if(!confirm('Are you sure you want to delete this column?')) return;

  const { error } = await client.from<Board>('board_columns').delete().match({ id: boardColumnId })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  emit('refreshBoard')

  // router.push('/boards')
}
</script>

<style scoped>
.block {
  background: #ccc;
  margin-bottom: 2rem;
}
</style>