<script setup lang="ts">
defineProps<{
  title: string
  terms: string[]
}>()

const headingId = useId()
</script>

<template>
  <section :aria-labelledby="headingId" class="rounded-[1.25rem] border bg-white px-5 py-5 xl:px-8 xl:py-7">
    <h2 :id="headingId" class="flex items-center gap-2 font-sans text-sm font-semibold xl:gap-3 xl:text-lg">
      <Icon name="lucide:info" class="size-4 shrink-0 text-muted xl:size-5" />
      {{ title }}
    </h2>
    <ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted xl:mt-3 xl:gap-x-6 xl:text-[0.9375rem]">
      <li v-for="term in terms" :key="term" class="before:mr-1.5 before:content-['•']">
        {{ term }}
      </li>
    </ul>
  </section>
</template>
