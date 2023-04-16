<template>
  <div :class="`px-3 h-6 rounded-full text-xs font-semibold inline-flex items-center ${badgeColor} mr-1`">
    <span :class="`w-2 h-2 rounded-full ${noText ? '' : 'mr-1'} ${circleColor}`"></span>
    <span v-show="!noText">
      <slot></slot>
    </span>
  </div>
</template>
<script setup lang="ts">
const column = defineProps<{
  color: string;
  noText?: boolean;
}>()

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

const circleColorVariants = {
  neutral: 'bg-neutral-400',
  stone: 'bg-stone-400',
  red: 'bg-red-400',
  orange: 'bg-orange-400',
  amber: 'bg-amber-400',
  yellow: 'bg-yellow-400',
  lime: 'bg-lime-400',
  green: 'bg-green-400',
  emerald: 'bg-emerald-400',
  teal: 'bg-teal-400',
  cyan: 'bg-cyan-400',
  sky: 'bg-sky-400',
  blue: 'bg-blue-400',
  indigo: 'bg-indigo-400',
  violet: 'bg-violet-400',
  purple: 'bg-purple-400',
  fuchsia: 'bg-fuchsia-400',
  pink: 'bg-pink-400',
  rose: 'bg-rose-400',
  gray: 'bg-gray-400'
}

const badgeColor = computed(() => {
  return colorVariants[column.color || 'gray']
})

const circleColor = computed(() => {
  return circleColorVariants[column.color || 'gray']
})

// add a computed css classes
</script>