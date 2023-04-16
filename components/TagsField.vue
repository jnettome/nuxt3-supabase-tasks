<template>
  <div class="tags-field my-4">
    <div class="current-tags block mb-2" v-if="localProps.taggings?.length > 0">
      <Badge :color="tagging.tags.color" v-for="tagging in localProps.taggings" :key="tagging.id">
        {{ tagging.tags.name || '' }}
      </Badge>
    </div>

    <button @click="toggleEditingTags" class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
      Edit Tags
    </button>

    <div v-if="isEditing" class="w-[300px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 mt-1">
      <div v-if="!isNewTag" class="tags-field__tags">

        <label class="cursor-pointer flex items-center py-2 my-1" v-for="tag in tags" :key="tag.id">
          <input type="checkbox" v-model="currentTaggings" :value="tag.id" class="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <Badge :color="tag.color">
            {{ tag.name }}
          </Badge>

          <svg v-if="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-4" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>

          <!-- <button @click="toggleEditing" class="ml-3 flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-400 dark:hover:text-gray-300 hover:dark:bg-gray-800"> -->
            <!-- <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg> -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg> -->
          <!-- </button> -->
        </label>
      </div>

      <button @click="toggleNewTag" class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
        <span v-if="!isNewTag">Create new tag</span>
        <span v-else>Back</span>
      </button>

      <div v-if="isNewTag" class="mt-2">
        <form @submit.stop.prevent="addTag">
          <input
            class="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600"
            type="text"
            ref="nameInput"
            placeholder="create new tag"
            v-model="newTag"
          />

          <ColorSelector @onColorSelected="onColorSelected" />

          <button type="submit" class="px-3 py-2 w-full rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
            Create Tag
          </button>
        </form>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { Tag } from '~/types/tags'

const localProps = defineProps<{
  taggings?: any,
  todoId: number,
  boardId: string,
}>()

const emit = defineEmits<{
  (event: 'onTagsUpdated', taggings: any, todoId: number): void
}>()

watch(() => localProps.todoId, () => {
  isEditing.value = false
})

const currentTaggings = computed({
  set (value) {
    emit('onTagsUpdated', value, localProps.todoId)
  },
  get () {
    const tagIds = localProps.taggings?.map((tag) => tag.tags.id) ?? []
    return tagIds
  }
})

const isEditing = ref(false)
const isNewTag = ref(false)
const isEditingLoading = ref(false)
const isLoading = ref(false)
const nameInput = ref()
const tag = ref()
const tagsModel = ref()

async function toggleEditingTags () {
  isEditing.value = !isEditing.value
}

// async function toggleEditSingleTag () {
//   if (isEditing.value) {
//     isEditingLoading.value = false
//     setTimeout(() => {
//       nameInput.value?.focus()
//     }, 100)
//   }
// }

async function toggleNewTag () {
  isNewTag.value = !isNewTag.value
  if (isEditing.value) {
    isEditingLoading.value = false
    setTimeout(() => {
      nameInput.value?.focus()
    }, 100)
  }
}

import type { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel: RealtimeChannel

const client = useSupabaseClient()
const user = useSupabaseUser()

const newTag = ref('')
const newColor = ref('')

async function onColorSelected (color: string) {
  newColor.value = color
}

const { data: tags, refresh } = await useAsyncData('tags', async () => {
  const { data, error } = await client.from<Tag>('tags')
    .select('id, name, color')
    .eq('user_id', user.value?.id)
    .order('created_at', { ascending: false })
  return data
})

async function addTag () {
  if (!newTag.value) return

  const { error } = await client.from<Tag>('tags').insert({ name: newTag.value, user_id: user.value?.id, color: newColor.value, board_id: localProps.boardId })

  if (error) {
    isEditingLoading.value = false
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  newTag.value = ''
  newColor.value = ''
  isNewTag.value = false
  refresh()
}

// Once page is mounted, listen to changes on the `collaborators` table and refresh collaborators when receiving event
// { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.value?.id}&board_id=eq.${route.params.id}` },
onMounted(() => {
  // Real time listener for new workouts
  isEditing.value = false
  realtimeChannel = client.channel('public:tags').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'tags', filter: `board_id=eq.${localProps.boardId}` },
    () => refresh()
  )
  // .on(
  //   'postgres_changes',
  //   { event: '*', schema: 'public', table: 'taggings', filter: `board_id=eq.${localProps.boardId}` },
  //   () => refresh()
  // )
  realtimeChannel.subscribe()
})
  // Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  client.removeChannel(realtimeChannel)
})

</script>