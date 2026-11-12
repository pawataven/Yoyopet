<script setup lang="ts">
const earningSteps = [
  { icon: null, title: 'ซื้อสินค้า YoYo', description: 'Shopee, TikTok Shop หรือ Lazada' },
  { icon: 'lucide:pointer', title: 'กรอกเลขคำสั่งซื้อ', description: 'ที่เมนู "กรอกเลขออเดอร์"' },
  { icon: 'lucide:clock', title: 'รอตรวจสอบ', description: 'แต้มเข้าหลังยืนยันรับสินค้า' },
  { icon: 'lucide:gift', title: 'แลกของรางวัล', description: 'คูปองส่วนลดและสินค้า YoYo' }
]
</script>

<template>
  <section aria-labelledby="earning-steps-heading" class="mt-8 xl:mt-9">
    <h2 id="earning-steps-heading" class="font-sans text-xl leading-tight font-semibold xl:text-[2rem]">
      สะสมแต้มง่าย ๆ 4 ขั้นตอน
    </h2>

    <ol class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mt-6 xl:grid-cols-4 xl:gap-6">
      <li
        v-for="(step, index) in earningSteps"
        :key="step.title"
        class="relative rounded-[1.25rem] bg-cream p-5 xl:px-8 xl:pt-8 xl:pb-6"
      >
        <span class="flex size-12 items-center justify-center rounded-full bg-white text-primary-dark xl:size-15" aria-hidden="true">
          <Icon v-if="step.icon" :name="step.icon" class="size-5 xl:size-6.5" />
          <OrderEntryIcon v-else class="size-5 xl:size-6.5" />
        </span>
        <span class="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-primary-soft font-number text-sm font-semibold text-primary-dark xl:top-8 xl:right-8 xl:size-9.5 xl:text-base" aria-hidden="true">
          {{ index + 1 }}
        </span>

        <h3 class="mt-4 font-sans text-base font-semibold xl:mt-8 xl:text-xl">
          <span class="sr-only">ขั้นตอนที่ {{ index + 1 }}: </span>{{ step.title }}
        </h3>
        <p class="mt-0.5 text-sm text-muted xl:text-[0.9375rem]">
          {{ step.description }}
        </p>
      </li>
    </ol>
  </section>
</template>
