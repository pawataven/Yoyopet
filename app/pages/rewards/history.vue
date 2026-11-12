<script setup lang="ts">
import type { RewardRedemption } from '~/types/reward'

type RedemptionKindFilter = 'all' | 'product' | 'coupon'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'ประวัติการแลก · YoyoPet',
  description: 'ของรางวัลและคูปองที่คุณแลกไปแล้ว'
})

const periodOptions = [
  { months: 1, label: '1 เดือนล่าสุด' },
  { months: 3, label: '3 เดือนล่าสุด' },
  { months: 6, label: '6 เดือนล่าสุด' },
  { months: 12, label: '1 ปีล่าสุด' }
]

// Computed once on the server and reused on the client so both render the same period
const today = useState('redemption-history-today', () => toLocalIsoDate(new Date()))
const selectedPeriodMonths = ref(3)
const since = computed(() => {
  const todayDate = new Date(`${today.value}T00:00:00`)
  return toLocalIsoDate(new Date(todayDate.getFullYear(), todayDate.getMonth() - selectedPeriodMonths.value, todayDate.getDate()))
})

const { redemptions, isLoading } = useRewardRedemptionHistory(since)

const selectedKind = ref<RedemptionKindFilter>('all')

function redemptionKind(redemption: RewardRedemption): Exclude<RedemptionKindFilter, 'all'> {
  return redemption.couponValueBaht !== null ? 'coupon' : 'product'
}

const kindFilters = computed(() => {
  const couponCount = redemptions.value.filter(redemption => redemptionKind(redemption) === 'coupon').length
  return [
    { value: 'all' as const, label: 'ทั้งหมด', count: redemptions.value.length },
    { value: 'product' as const, label: 'สินค้า', count: redemptions.value.length - couponCount },
    { value: 'coupon' as const, label: 'คูปอง', count: couponCount }
  ]
})

const visibleRedemptions = computed(() =>
  selectedKind.value === 'all'
    ? redemptions.value
    : redemptions.value.filter(redemption => redemptionKind(redemption) === selectedKind.value)
)

const periodSelectId = useId()
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb :trail="[{ label: 'ของรางวัล', to: '/rewards' }]" current-label="ประวัติการแลก" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        ประวัติการแลก
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ของรางวัลและคูปองที่คุณแลกไปแล้ว
      </p>
    </header>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-3 xl:mt-8">
      <fieldset>
        <legend class="sr-only">
          ประเภทการแลก
        </legend>
        <div class="flex flex-wrap gap-2 xl:gap-3">
          <label
            v-for="filter in kindFilters"
            :key="filter.value"
            class="flex h-10 cursor-pointer items-center rounded-full border bg-white px-4 text-sm transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-11 xl:px-6 xl:text-[0.9375rem]"
          >
            <input
              v-model="selectedKind"
              type="radio"
              name="redemption-kind"
              :value="filter.value"
              class="sr-only"
            >
            {{ filter.label }} ({{ formatNumber(filter.count) }})
          </label>
        </div>
      </fieldset>

      <div class="relative">
        <label :for="periodSelectId" class="sr-only">ช่วงเวลา</label>
        <Icon name="lucide:calendar" class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 xl:left-5 xl:size-5" />
        <select
          :id="periodSelectId"
          v-model="selectedPeriodMonths"
          class="h-11 cursor-pointer appearance-none rounded-full border bg-white pr-12 pl-11 text-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none xl:h-12 xl:w-75 xl:pl-13 xl:text-[0.9375rem]"
        >
          <option v-for="option in periodOptions" :key="option.months" :value="option.months">
            {{ option.label }}
          </option>
        </select>
        <Icon name="lucide:chevron-down" class="pointer-events-none absolute top-1/2 right-5 size-4.5 -translate-y-1/2" />
      </div>
    </div>

    <section aria-label="รายการแลก" class="mt-5 rounded-[1.25rem] border bg-white px-4 py-2 xl:mt-6 xl:px-8 xl:py-3">
      <ul v-if="visibleRedemptions.length" class="divide-y">
        <RedemptionHistoryItem v-for="redemption in visibleRedemptions" :key="redemption.id" :redemption="redemption" />
      </ul>
      <div v-else-if="!isLoading" class="py-14 text-center">
        <p class="text-muted xl:text-lg">
          ยังไม่มีการแลกในช่วงเวลานี้
        </p>
        <NuxtLink to="/rewards" class="mt-3 inline-block font-semibold text-primary-dark hover:underline">
          ไปหน้าของรางวัล ›
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
