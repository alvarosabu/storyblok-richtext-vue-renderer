import { createApp } from 'vue'
import { StoryblokVue } from '@storyblok/vue'
import App from './App.vue'
import TestComponent from './storyblok/TestComponent.vue'

const app = createApp(App)

app.use(StoryblokVue, {
  accessToken: import.meta.env.STORYBLOK_API_TOKEN,
})

// eslint-disable-next-line vue/component-definition-name-casing
app.component('test-component', TestComponent)

app.mount('#app')
