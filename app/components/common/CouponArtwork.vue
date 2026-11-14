<script setup lang="ts">
defineProps<{
  valueBaht: number
}>()
</script>

<template>
  <div class="relative flex flex-col items-center justify-center rounded-xl bg-primary text-white">
    <span class="absolute inset-3 rounded-lg border-2 border-dashed border-white/90 sm:inset-4 xl:inset-6" aria-hidden="true" />
    <span class="absolute top-1/2 -left-3 size-6 xl:-left-4 xl:size-8 -translate-y-1/2 rounded-full bg-white" aria-hidden="true" />
    <span class="absolute top-1/2 -right-3 size-6 xl:-right-4 xl:size-8 -translate-y-1/2 rounded-full bg-white" aria-hidden="true" />
    <img src="/logo/logo.png" alt="" class="absolute top-7 left-7 hidden size-7 sm:block xl:top-10 xl:left-11 xl:size-9">

    <span class="font-number text-5xl leading-none font-semibold xl:text-[4.5rem]">{{ formatNumber(valueBaht) }}</span>
    <span class="mt-2 text-xs font-medium sm:text-sm xl:mt-4 xl:text-[1.375rem]">คูปองส่วนลด (บาท)</span>
  </div>
</template>
