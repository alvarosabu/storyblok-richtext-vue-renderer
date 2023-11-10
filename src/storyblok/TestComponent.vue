<script setup lang="ts">
defineProps({
  blok: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="test">
    <pre>
      {{ blok }}
    </pre>
  </div>
</template>