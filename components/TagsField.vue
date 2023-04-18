<template>
  <div class="tags-field my-4">
    <div class="current-tags block mb-2" v-if="localProps.taggings?.length > 0 && displayTags">
      <Badge :color="tagging.tags.color" v-for="tagging in localProps.taggings" :key="tagging.id">
        {{ tagging.tags.name || '' }}
      </Badge>
    </div>

    <button v-if="displayEditButton" @click="toggleEditingTags" class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
      {{ $t('edit_tags') }}
    </button>

    <div v-if="isEditing" class="w-[300px] md:absolute lg:absolute bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 mt-1">
      <div v-if="!isNewTag" class="tags-field__tags">

        <label class="cursor-pointer flex items-center py-2 my-1" v-for="tag in tags" :key="tag.id">
          <input type="checkbox" v-model="currentTaggings" :value="tag.id" class="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <Badge :color="tag.color">
            {{ tag.name }}
          </Badge>

          <button @click="editTag(tag)" class="ml-auto flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-400 dark:hover:text-gray-300 hover:dark:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </button>
        </label>
      </div>

      <button @click="toggleNewTag" class="px-3 py-2 rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
        <span v-if="!isNewTag">{{ $t('create_new_tag') }}</span>
        <span v-else>{{ $t('back') }}</span>
      </button>

      <TagsForm v-if="isNewTag" :currentTag="currentTagForEditing" :boardId="localProps.boardId" @onTagsUpdated="onTagsUpdated" />

    </div>

  </div>
</template>

<script setup lang="ts">
import { Tag } from '~/types/tags'

const localProps = defineProps<{
  taggings?: any,
  todoId: number,
  boardId: string,
  displayEditButton: boolean,
  displayTags: boolean
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

const currentTagForEditing = ref()
async function editTag (tag: Tag) {
  currentTagForEditing.value = tag
  isNewTag.value = true
}

async function toggleNewTag () {
  isNewTag.value = !isNewTag.value
  currentTagForEditing.value = null

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

const { data: tags, refresh } = await useAsyncData('tags', async () => {
  const { data, error } = await client.from<Tag>('tags')
    .select('id, name, color')
    .eq('user_id', user.value?.id)
    .eq('board_id', localProps.boardId)
    .order('created_at', { ascending: false })
  return data
})

async function onTagsUpdated (tag?: Tag) {
  isNewTag.value = false
  refresh()
}

// { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.value?.id}&board_id=eq.${route.params.id}` },
onMounted(() => {
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