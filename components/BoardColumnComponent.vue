<template>
  <div class="block">
    <div class="flex items-center justify-between">
      <h3>{{ name }}</h3>

      <button
        class="ml-3 text-red-600"
        @click="removeColumn(id)"
      >
        Remove
      </button>
    </div>

    <form class="flex gap-2 my-2" @submit.prevent="addTask">
      <input
        v-model="newTask"
        class="w-full"
        type="text"
        name="newTask"
        placeholder="Make a coffee"
        autofocus
        :loading="loading"
      />
      <button type="submit">
        Add
      </button>
    </form>

    <div v-if="todos.length > 0" body-class="px-6 py-2">
      <div v-for="task in todos" :key="task.id">
        <div class="flex items-center justify-between">
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
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
// set props
const column = defineProps<{
  id: number,
  name: string,
  todos: Array<{id: number, task: string, board_id: number, board_column_id: number, position: number, is_complete: boolean, created_at: string }>
}>()

const emit = defineEmits<{
  (event: 'refreshBoard'): void
}>()

import { BoardColumn } from '~/types/board_columns'
import { Todo } from '~/types/todos'

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const newTask = ref('')
const route = useRoute()

// { data: tasks }
// const { data: { value: tasks } } = await useAsyncData('todos', async () => {
//   return await client.from<Todo>('todos')
//     .select('*')
//     .eq('user', user.value?.id)
//     .eq('board_id', route.params.id)
//     .eq('board_column_id', column.id)
// })

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