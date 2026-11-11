<script setup lang="ts">
const { pets } = usePets()
const { birthdayCoupon, isClaiming, claimBirthdayCoupon } = usePetBirthdayCoupon()
const { referral } = useReferral()
</script>

<template>
  <div class="page-container mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <MyPetsCard :pets="pets" />
    <PetBirthdayCard
      v-if="birthdayCoupon"
      :birthday-coupon="birthdayCoupon"
      :is-claiming="isClaiming"
      @claim="claimBirthdayCoupon"
    />
    <ReferralCard v-if="referral" :referral="referral" />
  </div>
</template>
