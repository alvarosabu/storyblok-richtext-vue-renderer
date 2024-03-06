<script setup lang="ts">
defineProps({ blok: Object })
</script>

<template>
  <div
    v-editable="blok"
    class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-center"
  >
    <StoryblokComponent
      v-for="inblok in blok.columns"
      :key="inblok._uid"
      :blok="inblok"
    />
  </div>
</template>
