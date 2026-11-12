<script setup lang="ts">
import type { MarketplaceId, OrderSubmissionFailure, OrderSubmissionResult } from '~/types/order'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'กรอกเลขคำสั่งซื้อ รับแต้ม · YoyoPet',
  description: 'ซื้อสินค้า YoYo จาก Shopee, TikTok Shop หรือ Lazada แล้วกรอกเลขคำสั่งซื้อเพื่อสะสมแต้ม'
})

const { earningRule } = usePointsEarningRule()
const { member } = useMember()
const { recentSubmissions } = useRecentOrderSubmissions()
const { faqs } = useFaqs('order-entry')

const selectedMarketplaceId = ref<MarketplaceId>('shopee')
const guideMarketplaceId = ref<MarketplaceId>('shopee')
const isGuideDialogOpen = ref(false)

const lastSubmission = ref<OrderSubmissionResult | null>(null)
const isSubmittedDialogOpen = ref(false)
const lastFailure = ref<OrderSubmissionFailure | null>(null)
const isFailedDialogOpen = ref(false)
const orderSubmitForm = useTemplateRef('orderSubmitForm')

watch(selectedMarketplaceId, (marketplaceId) => {
  guideMarketplaceId.value = marketplaceId
})

function showOrderNumberExample() {
  guideMarketplaceId.value = selectedMarketplaceId.value
  isGuideDialogOpen.value = true
}

async function showSubmissionStatus() {
  isSubmittedDialogOpen.value = false
  await nextTick()
  document.getElementById('recent-order-submissions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleFailed(failure: OrderSubmissionFailure) {
  lastFailure.value = failure
  isFailedDialogOpen.value = true
}

async function retryOrderSubmission() {
  isFailedDialogOpen.value = false
  await nextTick()
  orderSubmitForm.value?.focusOrderNumber()
}

function handleSubmitted(result: OrderSubmissionResult) {
  lastSubmission.value = result
  isSubmittedDialogOpen.value = true
}
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="กรอกเลขออเดอร์" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        กรอกเลขคำสั่งซื้อ รับแต้ม
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ซื้อสินค้า YoYo จาก Shopee, TikTok Shop หรือ Lazada แล้วกรอกเลขคำสั่งซื้อเพื่อสะสมแต้ม
      </p>
    </header>

    <div class="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,970fr)_minmax(0,686fr)] xl:mt-8 xl:gap-6">
      <OrderSubmitForm
        ref="orderSubmitForm"
        v-model:marketplace-id="selectedMarketplaceId"
        @submitted="handleSubmitted"
        @failed="handleFailed"
        @show-example="showOrderNumberExample"
      />

      <div class="grid gap-4 xl:gap-6">
        <OrderEarningRateCard
          v-if="earningRule"
          :earning-rule="earningRule"
          :member-tier="member?.tier ?? null"
        />
        <OrderNumberGuideCard v-model:marketplace-id="guideMarketplaceId" />
      </div>
    </div>

    <RecentOrderSubmissionsTable :submissions="recentSubmissions" />
    <FaqList v-if="faqs.length" :faqs="faqs" />

    <OrderNumberGuideDialog v-model:open="isGuideDialogOpen" v-model:marketplace-id="guideMarketplaceId" />
    <OrderSubmittedDialog
      v-model:open="isSubmittedDialogOpen"
      :submission="lastSubmission"
      @view-status="showSubmissionStatus"
    />
    <OrderSubmissionFailedDialog
      v-model:open="isFailedDialogOpen"
      :failure="lastFailure"
      @retry="retryOrderSubmission"
    />
  </div>
</template>
