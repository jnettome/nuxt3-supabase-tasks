<template>
  <div class="my-4" v-if="block.content">
    <!-- container mx-auto grid place-content-center -->
     <!-- prose-pre:dark:bg-zinc-300 prose-pre:text-gray-800 dark:bg-gray-100  -->
    <div
      class="prose-sm prose-slate text-sm"
      v-html="$mdRenderer.render(block.content)"
    />
  </div>
</template>   
<script lang="ts" setup>
  const props = defineProps({
    block: {
      type: Object,
      required: true,
    },
  });
  onBeforeMount(() => {
    // !["content"].every((propName) => props.block.hasOwnProperty(propName))
    //   ? console.error(`RichText.vue has not pass the block property validation`)
    //   : null;
  });
</script>
  