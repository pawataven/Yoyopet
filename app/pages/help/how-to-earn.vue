<script setup lang="ts">
definePageMeta({ hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'วิธีสะสมแต้มและคำถามที่พบบ่อย · YoyoPet',
  description: 'วิธีสะสมแต้ม YoYo Member อัตราการสะสมแต้ม และคำตอบสำหรับคำถามที่พบบ่อย'
})

const { faqs } = useFaqs()
const { earningRule } = usePointsEarningRule()
</script>

<template>
  <div>
    <MobilePageHeader title="วิธีสะสมแต้มและคำถาม" />

    <div class="page-container pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pt-5 md:pb-12 xl:pt-9 xl:pb-16">
      <div class="max-md:hidden">
        <PageBreadcrumb current-label="วิธีสะสมแต้ม" />

        <header class="mt-3 xl:mt-4">
          <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
            วิธีสะสมแต้มและคำถามที่พบบ่อย
          </h1>
          <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
            ทุกอย่างที่ต้องรู้เกี่ยวกับ YoYo Member
          </p>
        </header>
      </div>

      <EarningSteps />
      <EarningRateBanner v-if="earningRule" :earning-rule="earningRule" />
      <FaqList v-if="faqs.length" :faqs="faqs" />
      <ContactSupportCard />
    </div>
  </div>
</template>
