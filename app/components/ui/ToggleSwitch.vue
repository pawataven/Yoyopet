<script setup lang="ts">
const { disabled = false } = defineProps<{
  disabled?: boolean
}>()

const isOn = defineModel<boolean>({ required: true })
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isOn"
    :disabled="disabled"
    class="relative inline-flex h-6.5 w-12 shrink-0 items-center rounded-full p-0.75 transition-colors focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    :class="isOn ? 'bg-primary' : 'bg-border'"
    @click="isOn = !isOn"
  >
    <span
      class="size-5 rounded-full bg-white shadow-sm shadow-ink/20 transition-transform"
      :class="isOn && 'translate-x-5.5'"
      aria-hidden="true"
    />
  </button>
</template>
