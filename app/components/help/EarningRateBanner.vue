<script setup lang="ts">
import type { PointsEarningRule } from '~/types/help'

const props = defineProps<{
  earningRule: PointsEarningRule
}>()

// The base tier earns 1× so the desktop sentence only lists the tiers that earn extra
const bonusMultipliersLabel = computed(() =>
  props.earningRule.tierMultipliers
    .filter(({ multiplier }) => multiplier > 1)
    .map(({ tier, multiplier }, index) => `${index === 0 ? 'ระดับ ' : ''}${tier}${index === 0 ? ' ได้' : ''} ${formatNumber(multiplier)} เท่า`)
    .join(' · ')
)

function formatMultiplier(multiplier: number) {
  return `×${multiplier.toFixed(1)}`
}
</script>

<template>
  <section aria-label="อัตราการสะสมแต้ม" class="mt-6 rounded-[1.25rem] bg-primary p-5 text-white md:hidden">
    <p class="font-heading text-xl leading-tight">
      ทุกยอดซื้อ {{ formatNumber(earningRule.bahtPerPoint) }} บาท = 1 แต้ม
    </p>
    <p class="mt-1 text-xs text-white/85">
      ไม่รวมค่าส่ง · ปัดเศษลง · คูณตามระดับ
    </p>
    <ul v-if="earningRule.tierMultipliers.length" class="mt-4 grid auto-cols-fr grid-flow-col gap-2">
      <li
        v-for="{ tier, multiplier } in earningRule.tierMultipliers"
        :key="tier"
        class="min-w-0 rounded-xl bg-white/15 px-1.5 py-2 text-center"
      >
        <span class="block truncate text-xs text-white/85">{{ tier }}</span>
        <span class="block font-number text-sm font-semibold">{{ formatMultiplier(multiplier) }}</span>
      </li>
    </ul>
  </section>

  <section aria-label="อัตราการสะสมแต้ม" class="mt-10 flex flex-col gap-4 rounded-[1.25rem] bg-primary-soft p-5 max-md:hidden sm:flex-row sm:items-center sm:justify-between xl:mt-18 xl:min-h-29.5 xl:px-10 xl:py-6">
    <div>
      <p class="text-xl font-semibold text-primary-dark xl:text-[1.75rem] xl:leading-tight">
        ทุกยอดซื้อ {{ formatNumber(earningRule.bahtPerPoint) }} บาท = 1 แต้ม
      </p>
      <p v-if="bonusMultipliersLabel" class="mt-1 text-sm text-muted xl:mt-1.5 xl:text-[0.9375rem]">
        {{ bonusMultipliersLabel }}
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
