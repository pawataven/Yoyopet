<script setup lang="ts">
useSeoMeta({
  title: 'YoyoPet'
})
</script>

<template>
  <div class="pb-6 md:pb-12 xl:pb-20">
    <MemberOverview />
    <PromoBannerCarousel />
    <RecommendedRewards />
    <TopSpenderAndTier />
    <PetsAndReferral />
    <PointsAndCoupons />
    <ShopOnMarketplaces />
    <LineFriendPromptSheet />
  </div>
</template>
