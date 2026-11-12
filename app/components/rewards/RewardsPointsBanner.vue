<script setup lang="ts">
import type { ExpiringPoints, TierProgress } from '~/types/member'

defineProps<{
  points: number
  tierProgress: TierProgress
  expiringPoints: ExpiringPoints | null
}>()
</script>

<template>
  <section
    aria-label="แต้มของคุณ"
    class="mt-6 flex flex-col gap-5 rounded-[1.75rem] bg-primary p-5 text-white xl:mt-10 xl:flex-row xl:items-center xl:gap-0 xl:py-6 xl:pr-8 xl:pl-12"
  >
    <div class="flex items-start justify-between gap-4 xl:w-130 xl:shrink-0 xl:pr-26">
      <div>
        <p class="text-sm text-white/85 xl:text-[0.9375rem]">
          แต้มของคุณ
        </p>
        <p class="flex items-baseline gap-3 xl:gap-5">
          <span class="font-number text-[2.5rem] leading-tight font-semibold xl:text-[3.25rem]">{{ formatNumber(points) }}</span>
          <span class="text-base xl:text-lg">แต้ม</span>
        </p>
      </div>
      <NuxtLink
        to="/tiers"
        class="flex h-8 shrink-0 items-center rounded-full bg-white/20 px-4 text-sm font-semibold transition-colors hover:bg-white/30 xl:h-9.5 xl:px-6 xl:text-[0.9375rem]"
      >
        ระดับ {{ tierProgress.currentTier }}
      </NuxtLink>
    </div>

    <div class="min-w-0 flex-1 border-white/30 xl:border-l xl:py-3 xl:pl-8">
      <p class="text-sm xl:text-[0.9375rem]">
        <template v-if="tierProgress.nextTier">
          อีก {{ formatNumber(tierProgress.pointsToNextTier) }} แต้ม เลื่อนเป็น {{ tierProgress.nextTier }}
        </template>
        <template v-else>
          คุณอยู่ระดับสูงสุดแล้ว
        </template>
      </p>
      <div
        role="progressbar"
        :aria-valuenow="tierProgress.progressPercent"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="tierProgress.nextTier ? `ความคืบหน้าสู่ระดับ ${tierProgress.nextTier}` : 'ความคืบหน้าระดับสมาชิก'"
        class="mt-2 h-2 overflow-hidden rounded-full bg-white/30 xl:mt-2.5 xl:w-100"
      >
        <div class="h-full rounded-full bg-white" :style="{ width: `${tierProgress.progressPercent}%` }" />
      </div>
      <p v-if="expiringPoints" class="mt-2 flex items-center gap-2 text-xs text-white/90 xl:mt-2.5 xl:text-sm">
        <Icon name="lucide:clock" class="size-3.5 shrink-0 xl:size-4" />
        {{ formatNumber(expiringPoints.amount) }} แต้มจะหมดอายุ {{ formatThaiShortDate(expiringPoints.expiresAt) }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 xl:flex xl:shrink-0 xl:gap-4">
      <NuxtLink
        to="/rewards/history"
        class="flex h-11 items-center justify-center rounded-full border-2 border-white px-5 text-sm font-semibold transition-colors hover:bg-white/15 xl:h-12 xl:w-48 xl:text-base"
      >
        ประวัติการแลก
      </NuxtLink>
      <NuxtLink
        to="/help/how-to-earn"
        class="flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-12 xl:w-44 xl:text-base"
      >
        รับแต้มเพิ่ม
      </NuxtLink>
    </div>
  </section>
</template>
