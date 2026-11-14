<script setup lang="ts">
const { marketplaceStores } = useAppConfig()
const { earningRule } = usePointsEarningRule()
</script>

<template>
  <NuxtLink
    to="/orders/submit"
    class="group flex items-center gap-3.5 rounded-[1.375rem] bg-cocoa py-4 pr-3.5 pl-3.5 text-white"
  >
    <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary">
      <OrderEntryIcon class="size-6" />
    </span>

    <span class="min-w-0 flex-1">
      <span class="block font-heading text-base leading-snug font-medium min-[400px]:text-lg">กรอกเลขคำสั่งซื้อ รับแต้ม</span>
      <span v-if="earningRule" class="mt-0.5 block text-sm text-white/75">
        ทุก {{ formatNumber(earningRule.bahtPerPoint) }} บาท = 1 แต้ม
      </span>
    </span>

    <span class="flex shrink-0 flex-col items-end gap-2">
      <span class="flex size-7 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20" aria-hidden="true">
        <Icon name="lucide:chevron-right" class="size-4.5" />
      </span>
      <span class="flex gap-1">
        <img
          v-for="store in marketplaceStores"
          :key="store.id"
          :src="store.logoUrl"
          :alt="store.name"
          width="44"
          height="44"
          loading="lazy"
          class="size-5.5 rounded-md bg-white"
        >
      </span>
    </span>
  </NuxtLink>
</template>
