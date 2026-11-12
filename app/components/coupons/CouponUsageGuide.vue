<script setup lang="ts">
const { marketplaceStores } = useAppConfig()

function usageSteps(storeName: string) {
  return ['คัดลอกโค้ดจากหน้านี้', `ไปที่ร้าน YoYo Pet บน ${storeName}`, 'ใส่โค้ดส่วนลดตอนชำระเงิน']
}
</script>

<template>
  <section id="coupon-usage-guide" aria-labelledby="coupon-usage-guide-heading" class="mt-12 scroll-mt-24 xl:mt-20">
    <h2 id="coupon-usage-guide-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
      วิธีใช้คูปอง
    </h2>

    <ul class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:mt-6 xl:gap-6">
      <li v-for="store in marketplaceStores" :key="store.id" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
        <div class="flex items-center gap-3 xl:gap-5">
          <img :src="store.logoUrl" alt="" width="56" height="56" loading="lazy" class="size-10 shrink-0 rounded-xl xl:size-14">
          <h3 class="text-base xl:text-[1.375rem]">
            ใช้ที่ {{ store.name }}
          </h3>
        </div>
        <ol class="mt-4 space-y-2.5 xl:mt-7 xl:space-y-4">
          <li v-for="(step, index) in usageSteps(store.name)" :key="step" class="flex items-center gap-3 text-sm xl:gap-4 xl:text-base">
            <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft font-number text-xs font-semibold text-primary-dark xl:size-7 xl:text-sm" aria-hidden="true">
              {{ index + 1 }}
            </span>
            {{ step }}
          </li>
        </ol>
      </li>
    </ul>
  </section>
</template>
