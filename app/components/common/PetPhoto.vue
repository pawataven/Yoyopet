<script setup lang="ts">
const props = defineProps<{
  src: string
  alt: string
}>()

// Freshly uploaded photos are blob URLs, which ipx can't fetch on the server
const isLocalBlob = computed(() => props.src.startsWith('blob:'))
</script>

<template>
  <img v-if="isLocalBlob" :src="src" :alt="alt">
  <NuxtImg v-else :src="src" :alt="alt" />
</template>
