<script setup lang="ts">
defineProps<{
  sections: TermSection[]
}>()
</script>

<template>
  <div class="space-y-5 sm:space-y-8">
    <section v-for="section in sections" :key="section.title">
      <h3 class="text-base sm:text-[1.375rem]">
        {{ section.title }}
      </h3>
      <ul class="mt-1.5 space-y-1 text-sm text-muted sm:mt-2 sm:space-y-1.5 sm:text-[1.0625rem]">
        <li v-for="term in section.terms" :key="term" class="before:mr-1.5 before:content-['•']">
          {{ term }}
        </li>
      </ul>
    </section>
  </div>
</template>
