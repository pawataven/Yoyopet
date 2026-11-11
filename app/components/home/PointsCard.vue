<script setup lang="ts">
import type { ExpiringPoints, TierProgress } from '~/types/member'

defineProps<{
  points: number
  memberCode: string
  tierProgress: TierProgress
  expiringPoints: ExpiringPoints | null
}>()

const isMemberCardOpen = ref(false)
</script>

<template>
  <section aria-label="แต้มของฉัน" class="flex flex-col rounded-[1.75rem] bg-primary px-6 pt-5 pb-4 text-white xl:px-12 xl:pt-6 xl:pb-4">
    <div class="flex items-center justify-between">
      <p class="text-base text-white/85 xl:text-xl">
        แต้มคงเหลือ
      </p>
      <NuxtLink
        to="/tiers"
        class="flex h-9 items-center rounded-full bg-white/20 px-5 text-sm font-semibold transition-colors hover:bg-white/30 xl:h-11 xl:px-7 xl:text-xl"
      >
        ระดับ {{ tierProgress.currentTier }}
      </NuxtLink>
    </div>

    <div class="mt-2 flex items-end justify-between gap-4 xl:mt-3">
      <p class="flex items-baseline gap-4 xl:gap-6">
        <span class="font-number text-[4.5rem] leading-none font-semibold xl:text-[7rem]">{{ formatNumber(points) }}</span>
        <span class="text-xl xl:text-[1.625rem]">แต้ม</span>
      </p>
      <button
        type="button"
        aria-label="แสดง QR บัตรสมาชิก"
        aria-haspopup="dialog"
        class="mb-1 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-primary transition-colors hover:bg-primary-soft xl:size-18"
        @click="isMemberCardOpen = true"
      >
        <Icon name="lucide:qr-code" class="size-7 xl:size-9" />
      </button>
    </div>

    <div
      role="progressbar"
      :aria-valuenow="tierProgress.progressPercent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="tierProgress.nextTier ? `ความคืบหน้าสู่ระดับ ${tierProgress.nextTier}` : 'ความคืบหน้าระดับสมาชิก'"
      class="mt-5 h-2 overflow-hidden rounded-full bg-white/30"
    >
      <div class="h-full rounded-full bg-white" :style="{ width: `${tierProgress.progressPercent}%` }" />
    </div>

    <div class="mt-3 flex items-center justify-between gap-4 text-sm text-white/90 xl:mt-4 xl:text-lg">
      <p v-if="tierProgress.nextTier">
        อีก {{ formatNumber(tierProgress.pointsToNextTier) }} แต้ม เลื่อนเป็น {{ tierProgress.nextTier }}
      </p>
      <p v-else>
        คุณอยู่ระดับสูงสุดแล้ว
      </p>
      <p class="font-number text-sm font-semibold tracking-wide xl:text-base">
        {{ memberCode }}
      </p>
    </div>

    <div class="mt-3 flex items-center justify-between gap-4 border-t border-white/20 pt-3 text-sm xl:mt-4 xl:pt-4 xl:text-lg">
      <p v-if="expiringPoints" class="flex items-center gap-2 text-white/90">
        <Icon name="lucide:clock" class="size-4 shrink-0 xl:size-5" />
        {{ formatNumber(expiringPoints.amount) }} แต้มจะหมดอายุ {{ formatThaiShortDate(expiringPoints.expiresAt) }}
      </p>
      <span v-else />
      <NuxtLink to="/tiers" class="shrink-0 font-semibold hover:underline">
        ดูสิทธิ์ระดับ ›
      </NuxtLink>
    </div>

    <MemberCardDialog v-model:open="isMemberCardOpen" />
  </section>
</template>
