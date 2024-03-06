import { createApp } from 'vue'
import './style.css'
import { StoryblokVue, apiPlugin } from '@storyblok/vue'
import Grid from './components/grid.vue'
import Page from './components/page.vue'
import Teaser from './components/teaser.vue'
import Feature from './components/feature.vue'
import App from './App.vue'

const app = createApp(App)

app.component('Grid', Grid)
app.component('Page', Page)
app.component('Teaser', Teaser)
app.component('Feature', Feature)

app.use(StoryblokVue, {
  accessToken: 'OurklwV5XsDJTIE1NJaD2wtt',
  use: [apiPlugin],
})

app.mount('#app')
