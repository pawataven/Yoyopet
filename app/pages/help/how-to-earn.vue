<script setup lang="ts">
useSeoMeta({
  title: 'วิธีสะสมแต้มและคำถามที่พบบ่อย · YoyoPet',
  description: 'วิธีสะสมแต้ม YoYo Member อัตราการสะสมแต้ม และคำตอบสำหรับคำถามที่พบบ่อย'
})

const { faqs } = useFaqs()
const { earningRule } = usePointsEarningRule()
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="วิธีสะสมแต้ม" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        วิธีสะสมแต้มและคำถามที่พบบ่อย
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ทุกอย่างที่ต้องรู้เกี่ยวกับ YoYo Member
      </p>
    </header>

    <EarningSteps />
    <EarningRateBanner v-if="earningRule" :earning-rule="earningRule" />
    <FaqList v-if="faqs.length" :faqs="faqs" />
    <ContactSupportCard />
  </div>
</template>
