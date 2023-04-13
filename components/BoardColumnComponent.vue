<template>
  <div class="block">
    <h3>{{ name }}</h3>

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
      <button type="submit" variant="white">
        Add
      </button>
    </form>
    <div v-if="todos.length > 0" body-class="px-6 py-2 card">
      <ul>
        <li
          v-for="(task, index) of todos"
          :key="`task${index}`"
          :class="{ 'border-b': index !== todos.length - 1 }"
          class="border-gray-200 divide-y divide-gray-200"
        >
          <div class="py-2">
            <label :label-class="`block font-medium u-text-gray-700 ${task.is_complete && 'line-through'}`" wrapper-class="flex items-center justify-between w-full" :label="task.task" :name="`task${index}`">
              {{task.task}}
              <div class="flex items-center justify-between">
                <input type="checkbox"
                  v-model="task.is_complete"
                  :name="`task${index}`"
                  icon-off="heroicons-solid:x"
                  icon-on="heroicons-solid:check"
                  @click="updateTask(task)"
                />
                <button
                  class="ml-3 text-red-600"
                  size="sm"
                  variant="transparent"
                  icon="heroicons-outline:trash"
                  @click="removeTask(task)"
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
// set props
const column = defineProps<{
  id: number,
  name: string,
  todos: Array<{id: number, task: string}>
}>()

import { Todo } from '~/types/todos'

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const newTask = ref('')
const route = useRoute()

// { data: tasks }
const { data: { value: tasks } } = await useAsyncData('todos', async () => {
  return await client.from<Todo>('todos')
    .select('*')
    .eq('user', user.value?.id)
    .eq('board_id', route.params.id)
    .eq('board_column_id', column.id)
})

async function addTask () {
  if (newTask.value.length === 0) {
    return
  }

  loading.value = true
  const { error, data } = await client.from<Todo>('todos').upsert({
    user_id: user.value.id,
    task: newTask.value,
    is_complete: false,
    board_column_id: column.id,
    board_id: route.params.id
    // position?: number;
    // user_id?: string;
    // user?: string;
  })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  tasks.push(data[0])
  newTask.value = ''
  loading.value = false
}

async function updateTask (task: Todo) {
  const { error } = await client.from<Todo>('todos').update({ is_complete: task.is_complete }).match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }
}

async function removeTask (task: Todo) {
  const { error } = await client.from<Todo>('todos').delete().match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  tasks.splice(tasks.indexOf(task), 1)
}
</script>

<style scoped>
.block {
  background: #ccc;
  margin-bottom: 2rem;
}
</style>