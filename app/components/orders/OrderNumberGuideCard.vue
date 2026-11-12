<script setup lang="ts">
import type { MarketplaceId } from '~/types/order'

const selectedMarketplaceId = defineModel<MarketplaceId>('marketplaceId', { required: true })
</script>

<template>
  <section aria-labelledby="order-number-guide-heading" class="rounded-[1.5rem] border bg-white p-5 xl:p-8">
    <h2 id="order-number-guide-heading" class="text-base xl:text-[1.375rem]">
      หาเลขคำสั่งซื้อได้ที่ไหน
    </h2>
    <OrderNumberGuideContent v-model:marketplace-id="selectedMarketplaceId" class="mt-3 xl:mt-4" />
  </section>
</template>
