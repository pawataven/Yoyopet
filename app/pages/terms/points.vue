<script setup lang="ts">
useSeoMeta({
  title: 'เงื่อนไขการสะสมแต้ม · YoyoPet',
  description: 'เงื่อนไขการได้รับแต้ม การกรอกเลขคำสั่งซื้อ การยกเลิกและคืนสินค้า และอายุแต้มของ YoYo Member'
})

const { earningRule } = usePointsEarningRule()

const termSections = computed(() => buildPointsEarningTermSections(earningRule.value))
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="เงื่อนไขการสะสมแต้ม" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        เงื่อนไขการสะสมแต้ม
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        กรุณาอ่านก่อนกรอกเลขคำสั่งซื้อ
      </p>
    </header>

    <div class="mt-6 rounded-[1.25rem] border bg-white p-5 xl:mt-8 xl:p-10">
      <TermSectionList :sections="termSections" />
    </div>
  </div>
</template>
