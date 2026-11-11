<script setup lang="ts">
import { renderSVG } from 'uqr'

const props = defineProps<{
  value: string
  label: string
}>()

const qrSvg = computed(() =>
  renderSVG(props.value, {
    border: 0,
    blackColor: 'currentColor',
    whiteColor: 'transparent'
  })
)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- the SVG is generated locally by uqr from the value, not user HTML -->
  <div role="img" :aria-label="label" class="[&>svg]:block [&>svg]:size-full" v-html="qrSvg" />
</template>
