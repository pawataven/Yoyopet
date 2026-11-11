<script setup lang="ts">
import type { MemberCouponPreview } from '~/types/coupon'

defineProps<{
  couponPreview: MemberCouponPreview
}>()
</script>

<template>
  <section aria-labelledby="my-coupons-heading" class="flex flex-col rounded-[1.25rem] border bg-white p-6 xl:p-8">
    <div class="flex items-center gap-4">
      <h2 id="my-coupons-heading" class="text-lg leading-tight xl:text-2xl">
        คูปองของฉัน
      </h2>
      <span class="flex h-6 items-center rounded-full bg-primary/20 px-3 text-xs font-semibold text-primary-dark xl:h-7.5 xl:px-4.5 xl:text-sm">
        {{ formatNumber(couponPreview.totalCount) }} ใบ
      </span>
      <NuxtLink to="/coupons" class="ml-auto shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <ul v-if="couponPreview.coupons.length" class="mt-4 space-y-3 xl:mt-5 xl:space-y-4">
      <li v-for="coupon in couponPreview.coupons" :key="coupon.id">
        <CouponTicket :coupon="coupon" class="min-h-24 xl:min-h-34" />
      </li>
    </ul>
    <p v-else class="my-auto py-10 text-center text-sm text-muted">
      ยังไม่มีคูปองที่ใช้ได้
    </p>
  </section>
</template>
