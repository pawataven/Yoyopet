<script setup lang="ts">
const { pets } = usePets()
const { birthdayCoupon, isClaiming, claimBirthdayCoupon } = usePetBirthdayCoupon()
const { referral } = useReferral()

const isBirthdayCouponDialogOpen = ref(false)

async function handleClaimBirthdayCoupon() {
  await claimBirthdayCoupon()
  if (birthdayCoupon.value?.isClaimed) isBirthdayCouponDialogOpen.value = true
}
</script>

<template>
  <div class="page-container mt-4 md:mt-6">
    <div v-if="birthdayCoupon || referral" class="grid grid-cols-2 gap-3 md:hidden">
      <MobilePetBirthdayCard
        v-if="birthdayCoupon"
        :birthday-coupon="birthdayCoupon"
        :is-claiming="isClaiming"
        @claim="handleClaimBirthdayCoupon"
      />
      <MobileReferralCard v-if="referral" :referral="referral" :class="!birthdayCoupon && 'col-span-2'" />
    </div>

    <div class="grid grid-cols-1 gap-6 max-md:hidden md:grid-cols-2 xl:grid-cols-3">
      <MyPetsCard :pets="pets" />
      <PetBirthdayCard
        v-if="birthdayCoupon"
        :birthday-coupon="birthdayCoupon"
        :is-claiming="isClaiming"
        @claim="handleClaimBirthdayCoupon"
      />
      <ReferralCard v-if="referral" :referral="referral" />
    </div>

    <PetBirthdayCouponDialog
      v-if="birthdayCoupon"
      v-model:open="isBirthdayCouponDialogOpen"
      :birthday-coupon="birthdayCoupon"
    />
  </div>
</template>
