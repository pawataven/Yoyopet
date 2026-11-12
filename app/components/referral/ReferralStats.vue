<script setup lang="ts">
import type { ReferralSummary } from '~/types/referral'

const props = defineProps<{
  referral: ReferralSummary
}>()

const stats = computed(() => [
  { label: 'ชวนแล้ว', value: `${formatNumber(props.referral.referredCount)} คน` },
  { label: 'สมัครสำเร็จ', value: `${formatNumber(props.referral.signedUpCount)} คน` },
  { label: 'ได้แต้มแล้ว', value: `${formatNumber(props.referral.earnedPoints)} แต้ม` }
])
</script>

<template>
  <dl class="mt-4 grid grid-cols-3 gap-3 xl:mt-8 xl:gap-6">
    <div v-for="stat in stats" :key="stat.label" class="rounded-[1.25rem] border bg-white px-4 py-4 xl:px-8 xl:py-6">
      <dt class="text-xs text-muted xl:text-[0.9375rem]">
        {{ stat.label }}
      </dt>
      <dd class="mt-1 text-lg leading-tight font-semibold xl:mt-1.5 xl:text-[1.75rem]">
        {{ stat.value }}
      </dd>
    </div>
  </dl>
</template>
