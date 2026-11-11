<script setup lang="ts">
import type { ReferralSummary } from '~/types/referral'

const COPIED_FEEDBACK_MS = 2000

const props = defineProps<{
  referral: ReferralSummary
}>()

const hasCopied = ref(false)
let copiedFeedbackTimer: ReturnType<typeof setTimeout> | undefined

async function copyReferralCode() {
  try {
    await navigator.clipboard.writeText(props.referral.referralCode)
    hasCopied.value = true
    clearTimeout(copiedFeedbackTimer)
    copiedFeedbackTimer = setTimeout(() => (hasCopied.value = false), COPIED_FEEDBACK_MS)
  } catch {
    hasCopied.value = false
  }
}

onBeforeUnmount(() => clearTimeout(copiedFeedbackTimer))

const lineShareUrl = computed(() => {
  const message = `สมัครสมาชิก YoyoPet ด้วยโค้ด ${props.referral.referralCode} รับ ${props.referral.friendRewardPoints} แต้ม`
  return `https://line.me/R/share?text=${encodeURIComponent(message)}`
})
</script>

<template>
  <section aria-labelledby="referral-heading" class="flex flex-col rounded-[1.25rem] bg-primary-soft p-6 xl:px-8 xl:pt-8 xl:pb-7">
    <div class="xl:min-h-24">
      <span class="flex size-12 items-center justify-center rounded-full bg-white text-primary-dark xl:size-16">
        <Icon name="lucide:users" class="size-6 xl:size-7" />
      </span>
    </div>

    <h2 id="referral-heading" class="mt-4 font-sans text-lg leading-tight font-semibold xl:mt-2.5 xl:text-2xl">
      ชวนเพื่อนสมัคร รับ {{ formatNumber(referral.rewardPointsPerReferral) }} แต้ม
    </h2>
    <p class="mt-1 text-xs text-muted xl:text-[1.0625rem]">
      เพื่อนก็ได้ {{ formatNumber(referral.friendRewardPoints) }} แต้ม · ชวนแล้ว {{ formatNumber(referral.referredCount) }} คน
    </p>

    <div class="mt-auto pt-5 xl:pt-4">
      <div class="flex h-11 items-center justify-between gap-3 rounded-2xl bg-white pr-2 pl-4 xl:h-13 xl:pl-6">
        <span class="font-number text-base font-semibold tracking-wide xl:text-[1.1875rem]">{{ referral.referralCode }}</span>
        <button
          type="button"
          :aria-label="hasCopied ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ดชวนเพื่อน'"
          class="flex size-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-primary-soft hover:text-primary-dark"
          @click="copyReferralCode"
        >
          <Icon :name="hasCopied ? 'lucide:check' : 'lucide:copy'" class="size-4.5" :class="hasCopied && 'text-success'" />
        </button>
      </div>
      <a
        :href="lineShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 flex h-11 items-center justify-center rounded-2xl bg-line-green text-sm font-medium text-white transition-opacity hover:opacity-90 xl:mt-4 xl:h-13 xl:text-xl"
      >
        แชร์ผ่าน LINE
      </a>
      <span class="sr-only" aria-live="polite">{{ hasCopied ? 'คัดลอกโค้ดแล้ว' : '' }}</span>
    </div>
  </section>
</template>
