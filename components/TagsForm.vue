<template>
  <div class="mt-2">
    <form @submit.stop.prevent="onTagsFormSubmit">
      <input
        class="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600"
        type="text"
        ref="nameInput"
        :placeholder="$t('create_new_tag')"
        v-model="tagName"
      />

      <ColorSelector @onColorSelected="onColorSelected" />

      <button type="submit" class="px-3 py-2 w-full rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
        {{ localProps.currentTag?.id ? $t('edit_tag') : $t('create_tag') }}
      </button>
      
      <button v-if="localProps.currentTag?.id" @click.stop.prevent="onClickDelete" class="mt-2 px-3 py-2 w-full rounded text-sm font-semibold bg-slate-300 text-slate-700 hover:text-gray-200 hover:bg-slate-400 dark:bg-slate-800 dark:text-gray-300 hover:text-gray-200 hover:dark:bg-slate-950">
        {{ $t('delete_tag') }}
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
// import { Database } from '@/types/supabase.js'
import type { Tag } from '@/types/tags.js'

const client = useSupabaseClient()
const user = useSupabaseUser()

const emit = defineEmits<{
  (event: 'onTagsUpdated', tag?: Tag): void
}>()

const localProps = defineProps<{
  boardId: string,
  currentTag?: Tag
}>()

onMounted(() => {
  if (localProps.currentTag) {
    tagName.value = localProps.currentTag.name
    colorName.value = localProps.currentTag.color
  }
})

const tagName = ref('')
const colorName = ref('')
const isLoading = ref(false)

async function onColorSelected (color: string) {
  colorName.value = color
}

async function onTagsFormSubmit() {
  if (!tagName.value) return
  isLoading.value = true

  const params = { 
    name: tagName.value,
    user_id: user.value?.id,
    color: colorName.value,
    board_id: localProps.boardId
  }

  var error: any, tag: any
  
  if (localProps.currentTag?.id) {
    const { data: tag, error } = await client.from<Tag>('tags')
                                  .update(params)
                                  .eq('id', localProps.currentTag.id)
                                  .select('*').single()
  } else {
    const { data: tag, error } = await client.from<Tag>('tags')
                                .insert(params)
                                .select('*').single()
  }

  if (error) {
    isLoading.value = false
    return useNuxtApp().$toast.error(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }
  tagName.value = ''
  colorName.value = ''
  
  emit('onTagsUpdated', tag)
}

async function onClickDelete () {
  if(!confirm('Are you sure you want to delete this tag ?')) return

  const { error } = await client.from<Tag>('tags').delete().match({ id: localProps.currentTag?.id })

  if (error) {
    return useNuxtApp().$toast.error(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  emit('onTagsUpdated')
}
</script>
