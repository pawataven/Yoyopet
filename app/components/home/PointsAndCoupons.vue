<script setup lang="ts">
const { transactions } = useRecentPointTransactions()
const { couponPreview } = useMemberCouponPreview()
</script>

<template>
  <div class="page-container mt-6 grid gap-6 xl:grid-cols-[972fr_684fr]">
    <RecentPointsCard :transactions="transactions" />
    <MyCouponsCard v-if="couponPreview" :coupon-preview="couponPreview" />
  </div>
</template>
