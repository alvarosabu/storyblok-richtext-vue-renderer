import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'pathe'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  /* resolve: {
    alias: {
      '@alvarosabu/storyblok-richtext-vue-renderer': resolve(__dirname, '../../src/index.ts'),
    },
  }, */
})
