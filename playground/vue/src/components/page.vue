<script setup>
defineProps({ blok: Object })
</script>
 
<template>
  <div
    v-editable="blok"
    class="px-6"
  >
    <StoryblokComponent
      v-for="inblok in blok.body"
      :key="inblok._uid"
      :blok="inblok"
    />
  </div>
</template>