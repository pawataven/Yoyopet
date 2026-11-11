<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'ระดับสมาชิกและสิทธิพิเศษ · YoyoPet',
  description: 'ระดับสมาชิก YoYo Member สิทธิพิเศษของแต่ละระดับ และเกณฑ์การเลื่อนระดับ'
})

const { tierStatus } = useMemberTierStatus()
const { tierLevels } = useTierLevels()
const { benefitComparison } = useTierBenefitComparison()
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="ระดับสมาชิก" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        ระดับสมาชิกและสิทธิพิเศษ
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ยิ่งซื้อมาก ยิ่งได้สิทธิ์มาก ระดับคิดจากยอดซื้อสะสม 12 เดือน
      </p>
    </header>

    <template v-if="tierStatus">
      <TierStatusBanner :tier-status="tierStatus" />
      <TierLevelCards v-if="tierLevels.length" :tier-levels="tierLevels" :tier-status="tierStatus" />
      <TierBenefitComparisonTable
        v-if="tierLevels.length && benefitComparison.length"
        :tier-levels="tierLevels"
        :rows="benefitComparison"
        :current-tier="tierStatus.currentTier"
      />
    </template>
    <TierCalculationNote />
  </div>
</template>
