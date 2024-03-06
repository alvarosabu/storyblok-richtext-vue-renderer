<script setup>
const storyblokApi = useStoryblokApi()
const { data: articles } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'articles',
  is_startpage: false,
})
</script>

<template>
  <pre>
    {{ articles }}
  </pre>
</template>
