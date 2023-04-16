<template>
  <!-- bg-slate-300 text-slate-900 -->
  <div class="rounded-lg bg-slate-200 dark:bg-zinc-900 min-h-16 mr-4 w-full min-w-full md:max-w-lg md:min-w-[350px] md:w-1/4 lg:max-w-sm">
    <header class="flex items-center justify-between px-4 py-3 pt-5 mb-0">
      <!-- text-sm -->
      <div class="flex items-center">
        <div v-if="!isEditing">
          <h3 class="text-slate-700 dark:text-gray-400 font-semibold font-sans tracking-wide">
            {{ name }}
          </h3>
        </div>
        <div v-show="isEditing">
          <form class="flex items-center" @submit.prevent="updateColumn(form)">
            <input
              class="dark:bg-zinc-600 dark:text-gray-100 bg-slate-100 text-slate-700 p-2 font-semibold font-sans tracking-wide outline-0"
              type="text"
              name="name"
              ref="nameInput"
              :disabled="isEditingLoading"
              placeholder="Add column name"
              @keydown.esc="toggleEditing"
              v-model="form.name">
            <button type="submit" class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-300 dark:hover:text-gray-300 hover:dark:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </button>
          </form>
        </div>

        <button @click="toggleEditing" class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-300 dark:hover:text-gray-300 hover:dark:bg-gray-800">
          <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>

      <div class="flex">
        <button v-if="!isEditing" class="px-3 py-2 rounded text-sm font-semibold text-slate-700 bg-slate-300 hover:text-gray-200 hover:bg-slate-400 hover:dark:text-gray-200 dark:text-gray-300 dark:bg-slate-800 hover:dark:bg-slate-950" @click="toggleNewTask">
          <span v-if="!isShowNew">add task</span>
          <span v-else>close</span>
        </button>

        <button
          v-if="isEditing"
          class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-red-300 hover:text-red-700 hover:dark:text-red-300 hover:dark:bg-red-800"
          @click="removeColumn(id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
          </svg>
        </button>
      </div>

    </header>

    <form v-show="isShowNew" class="flex px-2 gap-2 my-2" @submit.prevent="addTask">
      <input
        v-model="newTask"
        class="w-full dark:bg-gray-700 px-3 py-2 outline-0"
        type="text"
        name="newTask"
        placeholder="Add a task"
        ref="newTaskField"
        :loading="loading"
        @keydown.esc="toggleNewTask"
      />
    </form>

    <!-- {{ drag }} -->
    <!-- v-if="todos.length > 0" -->
    <!-- <badge-component color="red">
      salve
    </badge-component> -->

    <div body-class="px-6 py-2">
      <draggable :animation="200" ghost-class="ghost-card" style="height: 90vh; overflow-y: auto;" item-key="position" v-model="itemsDraggable" @start="drag=true" @end="drag=false" group="people">
        <template #item="{ element }">
          <div @click="toggleModal(element)" class="mt-3 mx-2 px-3 py-3 dark:bg-zinc-800 bg-slate-300 rounded cursor-pointer shadow border border-gray-400 dark:border-black">
            <p class="dark:text-white text-gray-700 break-words font-sans text-sm tracking-wide">{{ element.task }}</p>
            <!-- font-semibold  -->
             <!-- text-sm -->

            <div class="flex mt-4 justify-between items-center">
              <span class="text-sm text-gray-400 dark:text-gray-600 truncate">{{ $dayjs(element.created_at).format('D MMM LT') }}</span>
            </div>

            <!-- numero de comentarios -->
            <!-- numero de attachments -->

            <Badge :noText="true" v-for="tag in element.taggings" :key="tag.id" :color="tag.tags.color" class="mt-2">
              {{ tag.tags.name }}
            </Badge>
          </div>
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
const isShowNew = ref(false)
const isEditing = ref(false)
const isEditingLoading = ref(false)
const nameInput = ref()

const newTask = ref('')
const newTaskField = ref()
const route = useRoute()

const form = ref({
  name: column.name,
  id: column.id
})

function toggleEditing () {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    isEditingLoading.value = false
    setTimeout(() => {
      nameInput.value?.focus()
    }, 100)
  }
}

function toggleNewTask () { 
  isShowNew.value = !isShowNew.value
  if (isShowNew.value) {
    setTimeout(() => {
      newTaskField.value?.focus()
    }, 100)
  }
}

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

async function updateColumn (column: any) {
  isEditingLoading.value = true

  const { error } = await client.from<BoardColumn>('board_columns').update({ name: column.name }).match({ id: column.id })

  if (error) {
    isEditingLoading.value = false
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  isEditing.value = false
  isEditingLoading.value = true

  emit('refreshBoard')
}

async function updateTaskPosition (taskId: number, position: number) {
  loading.value = true
  const { error } = await client.from<Todo>('todos').update({ position: position }).match({ id: taskId })

  if (error) {
    loading.value = false
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  emit('refreshBoard')
  loading.value = false
}

async function updateTaskBoardColumn (taskId: number, boardColumnId: number) {
  loading.value = true
  const { error } = await client.from<Todo>('todos').update({ board_column_id: boardColumnId }).match({ id: taskId })

  if (error) {
    loading.value = false
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
    loading.value = false
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
.ghost-card {
  opacity: 0.3;
  /* background: #F7FAFC; */
  border: 1px dashed #4299e1;
}
</style>