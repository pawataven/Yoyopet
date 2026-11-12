<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'ชวนเพื่อน รับแต้ม · YoyoPet',
  description: 'ชวนเพื่อนสมัคร YoYo Member และสั่งซื้อครั้งแรก รับแต้มทั้งคุณและเพื่อน'
})

const { referral } = useReferral()
const { referredFriends } = useReferredFriends()

const requestOrigin = useRequestURL().origin
const signUpUrl = computed(() => (referral.value ? buildReferralSignUpUrl(requestOrigin, referral.value.referralCode) : ''))
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="ชวนเพื่อน" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        ชวนเพื่อน รับแต้ม
      </h1>
      <p v-if="referral" class="mt-1 text-base text-muted xl:text-[1.375rem]">
        เพื่อนสมัครและสั่งซื้อครั้งแรก รับ {{ formatNumber(referral.rewardPointsPerReferral) }} แต้มทั้งคุณและเพื่อน
      </p>
    </header>

    <template v-if="referral">
      <ReferralShareCard :referral="referral" :sign-up-url="signUpUrl" />
      <ReferralStats :referral="referral" />
      <ReferralSteps :reward-points="referral.rewardPointsPerReferral" />
    </template>
    <ReferredFriendsTable :referred-friends="referredFriends" />
  </div>
</template>
