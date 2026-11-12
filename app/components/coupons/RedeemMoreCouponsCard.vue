<script setup lang="ts">
defineProps<{
  points: number
  redeemableRewardCount: number
}>()
</script>

<template>
  <div class="flex h-full flex-wrap items-center gap-4 rounded-2xl border-2 border-dashed border-primary/30 bg-white px-5 py-5 xl:gap-6 xl:px-8 xl:py-6">
    <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary xl:size-16" aria-hidden="true">
      <Icon name="lucide:gift" class="size-5 xl:size-7" />
    </span>
    <div class="min-w-0 flex-1">
      <p class="font-heading text-base font-medium xl:text-xl 2xl:text-2xl">
        แลกคูปองเพิ่ม
      </p>
      <p class="mt-0.5 text-xs text-muted xl:mt-1 xl:text-sm 2xl:text-base">
        คุณมี {{ formatNumber(points) }} แต้ม แลกได้อีก {{ formatNumber(redeemableRewardCount) }} รายการ
      </p>
    </div>
    <NuxtLink
      to="/rewards"
      class="flex h-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary px-5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-12 xl:px-6 xl:text-base 2xl:h-14 2xl:px-10"
    >
      ไปหน้าของรางวัล
    </NuxtLink>
  </div>
</template>
