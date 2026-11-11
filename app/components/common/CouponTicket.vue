<script setup lang="ts">
import type { MemberCoupon } from '~/types/coupon'

const props = defineProps<{
  coupon: MemberCoupon
}>()

const discountLabel = computed(() =>
  props.coupon.discountType === 'percent' ? `${props.coupon.discountValue}%` : formatNumber(props.coupon.discountValue)
)
const discountUnitLabel = computed(() => (props.coupon.discountType === 'percent' ? 'ส่วนลด' : 'บาท'))
const minSpendLabel = computed(() =>
  props.coupon.minSpendBaht ? `ขั้นต่ำ ${formatNumber(props.coupon.minSpendBaht)} บาท` : 'ไม่มีขั้นต่ำ'
)
</script>

<template>
  <article class="flex">
    <div class="relative flex w-24 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-white xl:w-40">
      <span class="absolute -top-2.5 -right-2.5 size-5 rounded-full bg-white xl:-top-3 xl:-right-3 xl:size-6" aria-hidden="true" />
      <span class="absolute -right-2.5 -bottom-2.5 size-5 rounded-full bg-white xl:-right-3 xl:-bottom-3 xl:size-6" aria-hidden="true" />
      <span class="font-number text-2xl leading-none font-semibold xl:text-[2.75rem]">{{ discountLabel }}</span>
      <span class="mt-1 text-xs text-white/85 xl:mt-2.5 xl:text-sm">{{ discountUnitLabel }}</span>
    </div>

    <div class="ml-1.5 flex min-w-0 flex-1 justify-between gap-3 rounded-2xl border px-4 py-3 xl:ml-2.5 xl:px-5 xl:pt-6 xl:pb-3.5">
      <div class="min-w-0">
        <h3 class="truncate font-sans text-base font-semibold xl:text-[1.375rem]">
          {{ coupon.title }}
        </h3>
        <p class="mt-0.5 text-xs text-muted xl:mt-2 xl:text-[0.9375rem]">
          {{ minSpendLabel }} · ใช้ได้ถึง {{ formatThaiShortDate(coupon.expiresAt) }}
        </p>
        <p class="mt-1 font-number text-sm font-semibold tracking-wide text-primary-dark xl:mt-1.5 xl:text-base">
          {{ coupon.code }}
        </p>
      </div>
      <NuxtLink
        :to="`/coupons/${coupon.id}`"
        class="flex h-8 shrink-0 items-center self-end rounded-full border border-primary px-4 text-xs font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white xl:h-10 xl:px-8.5 xl:text-base"
      >
        ใช้คูปอง
      </NuxtLink>
    </div>
  </article>
</template>
