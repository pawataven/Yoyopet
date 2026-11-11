<script setup lang="ts">
import type { MemberTierStatus } from '~/types/member'

defineProps<{
  tierStatus: MemberTierStatus
}>()
</script>

<template>
  <section
    aria-label="ระดับปัจจุบันของคุณ"
    class="mt-6 flex flex-col gap-5 rounded-3xl bg-primary p-6 text-white xl:mt-11 xl:flex-row xl:items-center xl:gap-0 xl:px-11 xl:py-8"
  >
    <div class="xl:w-88 xl:shrink-0">
      <p class="text-sm text-white/85 xl:text-[0.9375rem]">
        ระดับปัจจุบัน
      </p>
      <p class="mt-1 font-number text-[2.25rem] leading-tight font-semibold xl:mt-1.5 xl:text-[3.5rem]">
        {{ tierStatus.currentTier }}
      </p>
    </div>

    <div class="min-w-0 flex-1 xl:pr-70">
      <p class="text-sm xl:text-lg">
        ยอดซื้อสะสม 12 เดือน: {{ formatNumber(tierStatus.qualifyingSpendBaht) }} บาท ({{ formatNumber(tierStatus.qualifyingPoints) }} แต้ม)
      </p>
      <div
        role="progressbar"
        :aria-valuenow="tierStatus.progressPercent"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="tierStatus.nextTier ? `ความคืบหน้าสู่ระดับ ${tierStatus.nextTier}` : 'ความคืบหน้าระดับสมาชิก'"
        class="mt-3 h-2 overflow-hidden rounded-full bg-white/30 xl:mt-4 xl:h-2.5"
      >
        <div class="h-full rounded-full bg-white" :style="{ width: `${tierStatus.progressPercent}%` }" />
      </div>
      <p class="mt-3 text-xs text-white/90 xl:mt-4 xl:text-[0.9375rem]">
        <template v-if="tierStatus.nextTier">
          อีก {{ formatNumber(tierStatus.pointsToNextTier) }} แต้ม เลื่อนเป็น {{ tierStatus.nextTier }}
        </template>
        <template v-else>
          คุณอยู่ระดับสูงสุดแล้ว
        </template>
        · ปรับระดับครั้งถัดไป {{ formatThaiShortDate(tierStatus.nextReviewDate) }}
      </p>
    </div>

    <NuxtLink
      to="/#shop"
      class="flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-13.5 xl:w-52 xl:text-base"
    >
      ช้อปเพิ่ม
    </NuxtLink>
  </section>
</template>
