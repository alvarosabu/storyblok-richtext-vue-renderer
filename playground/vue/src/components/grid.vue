<script setup>
defineProps({ blok: Object })
</script>

<template>
  <div
    v-editable="blok"
    class="flex py-8 mb-6"
  >
    <div
      v-for="inblok in blok.columns"
      :key="inblok._uid"
      class="flex-auto px-6"
    >
      <StoryblokComponent :blok="inblok" />
    </div>
  </div>
</template>
