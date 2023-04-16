<template>
  <div class="color-selector">
    <div class="flex flex-wrap my-2 mx-2 content-center justify-center">
      <label
        :class="`${colorVariants[color]} ${color === selectedColor ? 'border-4' : ''} border-black dark:border-white transition-all rounded px-2 py-1 mr-2 mb-2 w-10 h-10 text-center cursor-pointer flex items-center justify-center`"
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: color }"
      >
        <input
          type="radio"
          :value="color"
          :checked="color === selectedColor"
          class="hidden"
          @change="selectColor(color)" />
        <span v-if="color === selectedColor" :class="borderVariants[color]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
        </span>
      </label>
    </div>
    
  </div>
</template>

<script lang="ts" setup>


const emit = defineEmits<{
  (event: 'onColorSelected', color: string): void
}>()

const selectedColor = ref('')
const colors = ref(['neutral',
'stone',
'red',
'orange',
'amber',
'yellow',
'lime',
'green',
'emerald',
'teal',
'cyan',
'sky',
'blue',
'indigo',
'violet',
'purple',
'fuchsia',
'pink',
'rose',
'gray'])

const colorVariants = {
  neutral: 'bg-neutral-300 text-neutral-700',
  stone: 'bg-stone-300 text-stone-700',
  red: 'bg-red-300 text-red-700',
  orange: 'bg-orange-300 text-orange-700',
  amber: 'bg-amber-300 text-amber-700',
  yellow: 'bg-yellow-300 text-yellow-700',
  lime: 'bg-lime-300 text-lime-700',
  green: 'bg-green-300 text-green-700',
  emerald: 'bg-emerald-300 text-emerald-700',
  teal: 'bg-teal-300 text-teal-700',
  cyan: 'bg-cyan-300 text-cyan-700',
  sky: 'bg-sky-300 text-sky-700',
  blue: 'bg-blue-300 text-blue-700',
  indigo: 'bg-indigo-300 text-indigo-700',
  violet: 'bg-violet-300 text-violet-700',
  purple: 'bg-purple-300 text-purple-700',
  fuchsia: 'bg-fuchsia-300 text-fuchsia-700',
  pink: 'bg-pink-300 text-pink-700',
  rose: 'bg-rose-300 text-rose-700',
  gray: 'bg-gray-300 text-gray-700'
}

const borderVariants = {
  neutral: 'border-neutral-300',
  stone: 'border-stone-300',
  red: 'border-red-300',
  orange: 'border-orange-300',
  amber: 'border-amber-300',
  yellow: 'border-yellow-300',
  lime: 'border-lime-300',
  green: 'border-green-300',
  emerald: 'border-emerald-300',
  teal: 'border-teal-300',
  cyan: 'border-cyan-300',
  sky: 'border-sky-300',
  blue: 'border-blue-300',
  indigo: 'border-indigo-300',
  violet: 'border-violet-300',
  purple: 'border-purple-300',
  fuchsia: 'border-fuchsia-300',
  pink: 'border-pink-300',
  rose: 'border-rose-300',
  gray: 'border-gray-300'
}

async function selectColor(val: any) {
  selectedColor.value = val
  emit('onColorSelected', val)
}
</script>