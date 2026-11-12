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
  <div class="page-container mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
    <MyPetsCard :pets="pets" />
    <template v-if="birthdayCoupon">
      <PetBirthdayCard
        :birthday-coupon="birthdayCoupon"
        :is-claiming="isClaiming"
        @claim="handleClaimBirthdayCoupon"
      />
      <PetBirthdayCouponDialog v-model:open="isBirthdayCouponDialogOpen" :birthday-coupon="birthdayCoupon" />
    </template>
    <ReferralCard v-if="referral" :referral="referral" />
  </div>
</template>
