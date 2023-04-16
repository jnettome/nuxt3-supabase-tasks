<template>
  <div :class="`px-3 h-6 rounded-full text-xs font-semibold flex items-center dark:bg-${badgeColor}-300 text-${badgeColor}-700`">
    <span :class="`w-2 h-2 rounded-full mr-1 dark:bg-${badgeColor}-400`"></span>
    <span>
      <slot></slot>
    </span>
  </div>
</template>
<script setup lang="ts">
const column = defineProps<{
  color: string;
}>()

// add a computed css classes
const badgeColor = computed(() => {
  return column.color
})
</script>