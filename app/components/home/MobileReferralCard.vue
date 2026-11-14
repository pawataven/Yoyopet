<script setup lang="ts">
import type { ReferralSummary } from '~/types/referral'

const props = defineProps<{
  referral: ReferralSummary
}>()

const lineShareUrl = computed(() => buildLineShareUrl(props.referral))
</script>

<template>
  <section aria-labelledby="referral-mobile-heading" class="flex flex-col rounded-[1.25rem] bg-primary-soft p-3.5">
    <span class="flex size-11 items-center justify-center rounded-full bg-white text-primary">
      <Icon name="lucide:users" class="size-5.5" />
    </span>

    <h2 id="referral-mobile-heading" class="mt-3.5 font-sans text-sm leading-snug font-semibold">
      <NuxtLink to="/referral" class="hover:text-primary-dark">
        ชวนเพื่อนสมัคร
      </NuxtLink>
    </h2>
    <p class="mt-0.5 text-xs text-muted">
      รับคนละ {{ formatNumber(referral.rewardPointsPerReferral) }} แต้ม
    </p>

    <div class="mt-auto pt-3">
      <a
        :href="lineShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-8.5 items-center justify-center rounded-full bg-line-green font-heading text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        แชร์ผ่าน LINE
      </a>
    </div>
  </section>
</template>
