<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        ref="modal-backdrop"
        class="fixed z-10 inset-0 overflow-y-auto bg-slate-200 bg-opacity-50 dark:bg-black dark:bg-opacity-50 backdrop-blur-sm backdrop-grayscale"
        v-show="show"
        v-escape="closeModal"
      >
        <!-- @click.self.prevent="closeModal"
        @keydown.esc="closeModal" -->
        <div
          class="flex items-start justify-center min-h-screen pt-4 md:pt-24 text-center"
        >
          <transition
            enter-active-class="transition ease-out duration-300 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
          >
            <div
              class="relative bg-slate-100 text-slate-800 dark:bg-black dark:text-white rounded-lg text-left shadow-2xl shadow-gray-600 p-8 w-full md:w-5/6 lg:w-3/6 outline-0"
              role="dialog"
              ref="modal"
              aria-modal="true"
              aria-labelledby="modal-headline"
              v-show="show"
              tabindex="-1"
              v-on-click-outside="closeModal"
            >
              <!-- @keydown.esc="closeModal" -->
              <button class="absolute top-4 right-4">
                <span @click="closeModal" class="text-slate-900 dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                  </svg>
                </span>
              </button>
              <slot><!-- content area --></slot>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { Directive } from 'vue'
const vEscape: Directive = {
  beforeMount(el, binding) {
    el._keydownCallback = (event: any) => {
      if (event.key === 'Escape') {
        binding.value()
      }
    }
    document.addEventListener('keydown', el._keydownCallback)
  },
  unmounted(el, binding) {
    document.removeEventListener('keydown', el._keydownCallback)
    delete el._keydownCallback
  }
}

import { vOnClickOutside } from '@vueuse/components'

const modal = ref<HTMLElement>()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (event: 'onCloseModal'): void
}>()

// watch and focus
watch(() => props.show, (value) => {
  if (value) {
    setTimeout(() => {
      modal.value?.focus()
    }, 300)
  }
})

async function closeModal() {
  emit('onCloseModal')
}

</script>