<script setup lang="ts">
import type { PointsEarningRule } from '~/types/help'

const props = defineProps<{
  earningRule: PointsEarningRule
}>()

const tierMultipliersLabel = computed(() =>
  props.earningRule.tierMultipliers
    .map(({ tier, multiplier }, index) => `${index === 0 ? 'ระดับ ' : ''}${tier}${index === 0 ? ' ได้' : ''} ${formatNumber(multiplier)} เท่า`)
    .join(' · ')
)
</script>

<template>
  <section aria-label="อัตราการสะสมแต้ม" class="mt-10 flex flex-col gap-4 rounded-[1.25rem] bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between xl:mt-18 xl:min-h-29.5 xl:px-10 xl:py-6">
    <div>
      <p class="text-xl font-semibold text-primary-dark xl:text-[1.75rem] xl:leading-tight">
        ทุกยอดซื้อ {{ formatNumber(earningRule.bahtPerPoint) }} บาท = 1 แต้ม
      </p>
      <p v-if="earningRule.tierMultipliers.length" class="mt-1 text-sm text-muted xl:mt-1.5 xl:text-[0.9375rem]">
        {{ tierMultipliersLabel }}
      </p>
    </div>

    <NuxtLink
      to="/tiers"
      class="flex h-11 shrink-0 items-center justify-center self-start rounded-xl border-2 border-primary bg-white px-6 text-sm font-semibold text-primary-dark transition-colors hover:bg-cream sm:self-auto xl:h-14 xl:w-50 xl:text-base"
    >
      ดูระดับสมาชิก
    </NuxtLink>
  </section>
</template>
