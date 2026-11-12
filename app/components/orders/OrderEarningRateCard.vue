<script setup lang="ts">
import type { PointsEarningRule } from '~/types/help'

const EXAMPLE_SPEND_BAHT = 1000

const props = defineProps<{
  earningRule: PointsEarningRule
  memberTier: string | null
}>()

const tierMultiplier = computed(() =>
  props.earningRule.tierMultipliers.find(({ tier }) => tier === props.memberTier)?.multiplier ?? 1
)

const examplePoints = computed(() =>
  Math.floor((EXAMPLE_SPEND_BAHT / props.earningRule.bahtPerPoint) * tierMultiplier.value)
)
</script>

<template>
  <section aria-labelledby="order-earning-rate-heading" class="rounded-[1.5rem] bg-primary-soft p-5 xl:p-8">
    <h2 id="order-earning-rate-heading" class="text-base xl:text-[1.375rem]">
      ได้แต้มเท่าไหร่?
    </h2>
    <p class="mt-1 text-xl font-semibold text-primary-dark xl:mt-2 xl:text-[1.75rem] xl:leading-tight">
      ทุกยอดซื้อ {{ formatNumber(earningRule.bahtPerPoint) }} บาท = 1 แต้ม
    </p>
    <p
      v-if="memberTier && tierMultiplier !== 1"
      class="mt-2 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white xl:mt-3 xl:px-4 xl:text-[0.9375rem]"
    >
      ระดับ {{ memberTier }} ได้ {{ formatNumber(tierMultiplier) }} เท่า
    </p>
    <p class="mt-3 rounded-xl bg-white px-4 py-2.5 text-xs xl:mt-4 xl:px-5 xl:py-3 xl:text-[0.9375rem]">
      ตัวอย่าง: ยอดซื้อ {{ formatNumber(EXAMPLE_SPEND_BAHT) }} บาท → ได้ {{ formatNumber(examplePoints) }} แต้ม
    </p>
  </section>
</template>
