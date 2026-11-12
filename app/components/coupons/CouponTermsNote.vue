<script setup lang="ts">
// TODO: confirm the final coupon terms with the business team
const couponTerms = [
  'ใช้ได้ 1 ใบต่อ 1 คำสั่งซื้อ',
  'ใช้ร่วมกับโปรโมชันอื่นของร้านไม่ได้',
  'คูปองที่หมดอายุแล้วคืนแต้มไม่ได้',
  'คูปองเป็นสิทธิ์เฉพาะบุคคล โอนให้ผู้อื่นไม่ได้'
]
</script>

<template>
  <section aria-labelledby="coupon-terms-heading" class="mt-6 rounded-[1.25rem] border bg-white px-5 py-5 xl:mt-8 xl:px-8 xl:py-7">
    <h2 id="coupon-terms-heading" class="flex items-center gap-2 font-sans text-sm font-semibold xl:gap-3 xl:text-lg">
      <Icon name="lucide:info" class="size-4 shrink-0 text-muted xl:size-5" />
      เงื่อนไขการใช้คูปอง
    </h2>
    <ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted xl:mt-3 xl:gap-x-6 xl:text-[0.9375rem]">
      <li v-for="term in couponTerms" :key="term" class="before:mr-1.5 before:content-['•']">
        {{ term }}
      </li>
    </ul>
  </section>
</template>
