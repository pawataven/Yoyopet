<script setup lang="ts">
const redemptionSteps = [
  { icon: 'lucide:pointer', title: 'เลือกของรางวัล', description: 'เลือกคูปองหรือสินค้าที่แต้มพอแลก' },
  { icon: 'lucide:check', title: 'กดแลกและยืนยัน', description: 'ระบบหักแต้มทันทีหลังยืนยัน' },
  { icon: 'lucide:truck', title: 'รับคูปองหรือรอจัดส่ง', description: 'คูปองเข้า "คูปองของฉัน" สินค้าส่งใน 3–5 วัน' },
  { icon: 'lucide:ticket', title: 'ใช้คูปองตอนสั่งซื้อ', description: 'ใส่โค้ดตอนชำระเงินที่ร้าน YoYo' }
]
</script>

<template>
  <section aria-labelledby="reward-redemption-steps-heading" class="mt-12 xl:mt-17">
    <h2 id="reward-redemption-steps-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
      วิธีแลกของรางวัล
    </h2>

    <ol class="mt-4 grid gap-3 sm:grid-cols-2 xl:mt-6 xl:grid-cols-4 xl:gap-6">
      <li v-for="(step, index) in redemptionSteps" :key="step.title" class="rounded-[1.25rem] bg-cream p-5 xl:px-8 xl:pt-8 xl:pb-7">
        <div class="flex items-start justify-between">
          <span class="flex size-11 items-center justify-center rounded-full bg-white text-primary xl:size-16" aria-hidden="true">
            <Icon :name="step.icon" class="size-5 xl:size-7" />
          </span>
          <span class="flex size-7 items-center justify-center rounded-full bg-primary-soft font-number text-sm font-semibold text-primary-dark xl:size-10 xl:text-base">
            <span class="sr-only">ขั้นตอนที่</span>{{ index + 1 }}
          </span>
        </div>
        <h3 class="mt-5 font-sans text-base font-semibold xl:mt-10 xl:text-xl">
          {{ step.title }}
        </h3>
        <p class="mt-0.5 text-xs text-muted xl:mt-1 xl:text-[0.9375rem]">
          {{ step.description }}
        </p>
      </li>
    </ol>
  </section>
</template>
