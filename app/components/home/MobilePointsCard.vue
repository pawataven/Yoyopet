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
  <section aria-label="แต้มของฉัน" class="rounded-[1.25rem] bg-white px-4.5 pt-4 pb-3.5 shadow-[0_0.3125rem_0] shadow-primary-soft">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <p class="text-base text-muted">
            แต้มคงเหลือ
          </p>
          <NuxtLink
            to="/tiers"
            class="flex h-6.5 items-center rounded-full bg-primary-soft px-2.5 text-sm font-semibold text-primary-dark"
          >
            ระดับ {{ tierProgress.currentTier }}
          </NuxtLink>
        </div>
        <p class="mt-1.5 flex items-baseline gap-3 text-primary">
          <span class="font-number text-[3.25rem] leading-none font-semibold">{{ formatNumber(points) }}</span>
          <span class="text-xl font-semibold">แต้ม</span>
        </p>
      </div>

      <button
        type="button"
        aria-haspopup="dialog"
        class="flex shrink-0 flex-col items-center gap-1.5 text-xs text-muted"
        @click="isMemberCardOpen = true"
      >
        <span class="flex size-13 items-center justify-center rounded-2xl bg-primary text-white transition-colors hover:bg-primary-dark">
          <Icon name="lucide:qr-code" class="size-6.5" />
        </span>
        บัตรสมาชิก
      </button>
    </div>

    <div
      role="progressbar"
      :aria-valuenow="tierProgress.progressPercent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="tierProgress.nextTier ? `ความคืบหน้าสู่ระดับ ${tierProgress.nextTier}` : 'ความคืบหน้าระดับสมาชิก'"
      class="relative mt-3 h-2 rounded-full bg-primary-soft"
    >
      <div class="h-full rounded-full bg-primary" :style="{ width: `${tierProgress.progressPercent}%` }" />
      <span
        class="absolute top-1/2 size-4 -translate-1/2 rounded-full border-3 border-primary bg-white"
        :style="{ left: `${tierProgress.progressPercent}%` }"
        aria-hidden="true"
      />
    </div>

    <div class="mt-3 flex items-center justify-between gap-3 text-sm">
      <p v-if="tierProgress.nextTier">
        อีก {{ formatNumber(tierProgress.pointsToNextTier) }} แต้ม เลื่อนเป็น {{ tierProgress.nextTier }}
      </p>
      <p v-else>
        คุณอยู่ระดับสูงสุดแล้ว
      </p>
      <p class="shrink-0 font-number tracking-wide text-muted/70">
        {{ memberCode }}
      </p>
    </div>

    <div class="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-sm">
      <p v-if="expiringPoints" class="flex min-w-0 items-center gap-2 text-muted">
        <Icon name="lucide:clock" class="size-4.5 shrink-0 text-pending" />
        {{ formatNumber(expiringPoints.amount) }} แต้มหมดอายุ {{ formatThaiShortDate(expiringPoints.expiresAt) }}
      </p>
      <span v-else />
      <NuxtLink to="/tiers" class="flex shrink-0 items-center font-semibold text-primary-dark hover:underline">
        สิทธิ์ระดับ
        <Icon name="lucide:chevron-right" class="size-4" />
      </NuxtLink>
    </div>

    <MemberCardDialog v-model:open="isMemberCardOpen" />
  </section>
</template>
