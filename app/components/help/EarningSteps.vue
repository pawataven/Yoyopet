<script setup lang="ts">
// TODO: confirm the 7-day return window with the YoYo team; each marketplace sets its own
const earningSteps = [
  { icon: 'lucide:shopping-bag', title: 'ซื้อสินค้า YoYo', description: 'ที่ Shopee · TikTok Shop · Lazada' },
  {
    icon: 'lucide:receipt-text',
    title: 'กรอกเลขคำสั่งซื้อ',
    description: 'ที่เมนู "กรอกเลขออเดอร์"',
    // Below xl the order entry lives in the mobile tab bar, not the top menu
    descriptionWithTabBar: 'กดปุ่ม "รับแต้ม" ตรงกลางแถบล่าง'
  },
  { icon: 'lucide:clock', title: 'รอร้านตรวจ + พ้นระยะคืน 7 วัน', description: 'ระหว่างนี้เป็นแต้มรอยืนยัน' },
  { icon: 'lucide:gift', title: 'แต้มเข้า แลกของรางวัลได้', description: 'แลกสินค้าหรือคูปองส่วนลด' }
]
</script>

<template>
  <section aria-labelledby="earning-steps-heading" class="md:mt-8 xl:mt-9">
    <h2 id="earning-steps-heading" class="font-sans text-lg leading-tight font-semibold md:text-xl xl:text-[2rem]">
      <span class="md:hidden">สะสมแต้มง่าย ๆ 4 ขั้น</span>
      <span class="max-md:hidden">สะสมแต้มง่าย ๆ 4 ขั้นตอน</span>
    </h2>

    <ol class="mt-4 md:grid md:grid-cols-2 md:gap-4 xl:mt-6 xl:grid-cols-4 xl:gap-6">
      <li
        v-for="(step, index) in earningSteps"
        :key="step.title"
        class="relative flex gap-3.5 pb-5 last:pb-0 md:block md:rounded-[1.25rem] md:bg-cream md:p-5 xl:px-8 xl:pt-8 xl:pb-6"
      >
        <span
          v-if="index < earningSteps.length - 1"
          class="absolute top-11 bottom-0 left-5.25 w-0.5 bg-primary-soft md:hidden"
          aria-hidden="true"
        />
        <span class="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary md:size-12 md:bg-white md:text-primary-dark xl:size-15" aria-hidden="true">
          <Icon :name="step.icon" class="size-5 xl:size-6.5" />
        </span>
        <span class="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-primary-soft font-number text-sm font-semibold text-primary-dark max-md:hidden xl:top-8 xl:right-8 xl:size-9.5 xl:text-base" aria-hidden="true">
          {{ index + 1 }}
        </span>

        <div class="min-w-0 pt-1 md:pt-0">
          <h3 class="font-sans text-[0.9375rem] font-semibold md:mt-4 md:text-base xl:mt-8 xl:text-xl">
            <span class="sr-only">ขั้นตอนที่ </span><span class="md:sr-only">{{ index + 1 }}. </span>{{ step.title }}
          </h3>
          <p class="mt-0.5 text-xs text-muted md:text-sm xl:text-[0.9375rem]">
            <template v-if="step.descriptionWithTabBar">
              <span class="xl:hidden">{{ step.descriptionWithTabBar }}</span>
              <span class="max-xl:hidden">{{ step.description }}</span>
            </template>
            <template v-else>
              {{ step.description }}
            </template>
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>
