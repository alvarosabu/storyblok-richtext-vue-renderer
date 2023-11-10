<script setup lang="ts">
import { useSbRichtext } from '../'

const props = defineProps<{ doc: any; resolvers?: any }>()

const { render } = useSbRichtext({
  resolvers: props.resolvers,
})

/* console.log(render(props.doc)) */
const root = () => render(props.doc)
</script>

<template>
  <root />
</template>