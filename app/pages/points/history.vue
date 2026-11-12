<script setup lang="ts">
import type { DateRange, PointHistoryFilter } from '~/types/points'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'ประวัติแต้ม · YoyoPet',
  description: 'ดูแต้มที่ได้รับ ใช้ไป และหมดอายุทั้งหมดของ YoYo Member'
})

// Computed once on the server and reused on the client so both render the same default range
const today = useState('point-history-today', () => toLocalIsoDate(new Date()))
const dateRange = useState<DateRange>('point-history-date-range', () => {
  const todayDate = new Date(`${today.value}T00:00:00`)
  const startOfPreviousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1)
  return { from: toLocalIsoDate(startOfPreviousMonth), to: today.value }
})
const selectedFilter = ref<PointHistoryFilter>('all')

const { summary } = usePointsSummary()
const { expiryBatches } = usePointExpirySchedule()
const { transactions, isLoading } = usePointTransactionHistory(dateRange)

const filteredTransactions = computed(() =>
  transactions.value.filter(transaction => matchesPointHistoryFilter(transaction, selectedFilter.value))
)
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="ประวัติแต้ม" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        ประวัติแต้ม
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ดูแต้มที่ได้รับ ใช้ไป และหมดอายุทั้งหมด
      </p>
    </header>

    <PointsSummaryCards v-if="summary" :summary="summary" />

    <div class="mt-6 flex flex-wrap items-center justify-between gap-3 xl:mt-10">
      <PointHistoryFilterChips v-model="selectedFilter" />
      <PointHistoryDateRangePicker v-model="dateRange" :today="today" />
    </div>

    <div class="mt-6 grid grid-cols-1 items-start gap-6 xl:mt-9 xl:grid-cols-[minmax(0,1fr)_34rem]">
      <PointHistoryMonthGroups v-if="filteredTransactions.length" :transactions="filteredTransactions" />
      <p v-else-if="!isLoading" class="rounded-[1.25rem] border bg-white py-14 text-center text-sm text-muted xl:text-lg">
        ไม่มีรายการในช่วงเวลานี้
      </p>
      <div v-else aria-hidden="true" />
      <ExpiringPointsCard :expiry-batches="expiryBatches" />
    </div>
  </div>
</template>
