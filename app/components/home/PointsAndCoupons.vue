<script setup lang="ts">
const { transactions } = useRecentPointTransactions()
const { couponPreview } = useMemberCouponPreview()
</script>

<template>
  <div class="page-container mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,972fr)_minmax(0,684fr)]">
    <RecentPointsCard :transactions="transactions" />
    <MyCouponsCard v-if="couponPreview" :coupon-preview="couponPreview" />
  </div>
</template>
