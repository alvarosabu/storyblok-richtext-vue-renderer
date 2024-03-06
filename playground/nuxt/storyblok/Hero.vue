<script setup lang="ts">
defineProps({ blok: Object })
</script>

<template>
  <div
    v-editable="blok"
    class="w-full p-12 bg-[#f7f6fd] text-center relative min-h-[600px] flex flex-col justify-center items-center"
    :style="{
      backgroundImage: `url(${blok.background_image?.filename})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="">
      <h3 class="text-7xl text-white font-bold">
        {{ blok.headline }}
      </h3>
      <p class="text-4xl text-white font-bold">
        {{ blok.subheadline }}
      </p>
    </div>
  </div>
</template>
