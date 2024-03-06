<script setup>
import { useStoryblok, useStoryblokApi } from '@storyblok/vue'

const story = await useStoryblok('home', { version: 'draft' })

const storyblokApi = useStoryblokApi()

const { data: articles } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'blog',
  is_startpage: false,
})
</script>
 
<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
  />
</template>