<script setup lang="ts" generic="TValue extends string">
defineProps<{
  options: { value: TValue, label: string }[]
  name: string
}>()

const selectedValue = defineModel<TValue | null>({ required: true })
</script>

<template>
  <div class="flex flex-wrap gap-2.5">
    <label
      v-for="option in options"
      :key="option.value"
      class="flex h-11 cursor-pointer items-center rounded-full border-2 px-5 text-base transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-11.5 xl:px-6 xl:text-lg"
    >
      <input
        v-model="selectedValue"
        type="radio"
        :name="name"
        :value="option.value"
        class="sr-only"
      >
      {{ option.label }}
    </label>
  </div>
</template>
