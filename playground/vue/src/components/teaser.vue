<script setup>
import { SbRichText } from '@alvarosabu/storyblok-richtext-vue-renderer'

defineProps({ blok: Object })
</script>

<template>
  <div
    v-editable="blok"
    class="py-8 mb-6 text-5xl font-bold text-center"
  >
    {{ blok.headline }}

    <SbRichText v-if="blok.content" :doc="blok.content" />
  </div>
</template>
