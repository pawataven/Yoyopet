<script setup lang="ts">
import type { SubmittedOrderFilter, SubmittedOrderQuery } from '~/types/order'

const PAGE_SIZE = 8
const SEARCH_DEBOUNCE_MS = 300

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'รายการที่ส่งทั้งหมด · YoyoPet',
  description: 'ติดตามสถานะเลขคำสั่งซื้อที่ส่งสะสมแต้ม'
})

const filterOptions: { value: SubmittedOrderFilter, label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'pending', label: 'รอตรวจสอบ' },
  { value: 'rejected', label: 'ไม่ผ่าน' }
]

const selectedFilter = ref<SubmittedOrderFilter>('all')
const searchInput = ref('')
const appliedSearch = ref('')
const currentPage = ref(1)

const query = computed<SubmittedOrderQuery>(() => ({
  filter: selectedFilter.value,
  search: appliedSearch.value,
  page: currentPage.value,
  pageSize: PAGE_SIZE
}))

const { orderPage, isLoading } = useSubmittedOrders(query)

const totalPages = computed(() => Math.max(1, Math.ceil(orderPage.value.totalCount / PAGE_SIZE)))

let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined
watch(searchInput, (value) => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    appliedSearch.value = value.trim()
    currentPage.value = 1
  }, SEARCH_DEBOUNCE_MS)
})
onBeforeUnmount(() => clearTimeout(searchDebounceTimer))

watch(selectedFilter, () => {
  currentPage.value = 1
})

const orderListSection = useTemplateRef('orderListSection')
watch(currentPage, () => {
  orderListSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const selectedOrderId = ref<string | null>(null)
const isOrderDetailDialogOpen = ref(false)

function showOrderDetail(orderId: string) {
  selectedOrderId.value = orderId
  isOrderDetailDialogOpen.value = true
}

const searchInputId = useId()

const emptyMessage = computed(() => {
  if (appliedSearch.value) return 'ไม่พบเลขคำสั่งซื้อที่ค้นหา'
  if (selectedFilter.value !== 'all') return 'ไม่มีรายการในหมวดนี้'
  return 'ยังไม่มีรายการที่ส่ง'
})
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb
      :trail="[{ label: 'กรอกเลขออเดอร์', to: '/orders/submit' }]"
      current-label="รายการทั้งหมด"
    />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        รายการที่ส่งทั้งหมด
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ติดตามสถานะเลขคำสั่งซื้อที่ส่งสะสมแต้ม
      </p>
    </header>

    <section ref="orderListSection" aria-label="รายการคำสั่งซื้อที่ส่ง" class="mt-6 scroll-mt-24 xl:mt-10 xl:scroll-mt-32">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <fieldset>
          <legend class="sr-only">
            กรองตามสถานะ
          </legend>
          <div class="flex flex-wrap gap-2 xl:gap-2.5">
            <label
              v-for="option in filterOptions"
              :key="option.value"
              class="flex h-10 cursor-pointer items-center rounded-full border bg-white px-4 text-sm transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-11 xl:min-w-34 xl:justify-center xl:px-6 xl:text-[0.9375rem]"
            >
              <input
                v-model="selectedFilter"
                type="radio"
                name="submitted-order-filter"
                :value="option.value"
                class="sr-only"
              >
              {{ option.label }} ({{ formatNumber(orderPage.countByFilter[option.value]) }})
            </label>
          </div>
        </fieldset>

        <div class="relative w-full sm:w-64 xl:w-88">
          <label :for="searchInputId" class="sr-only">ค้นหาเลขคำสั่งซื้อ</label>
          <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted xl:left-5 xl:size-5" />
          <input
            :id="searchInputId"
            v-model="searchInput"
            type="search"
            autocomplete="off"
            spellcheck="false"
            placeholder="ค้นหาเลขคำสั่งซื้อ"
            class="h-10 w-full rounded-full border bg-white pr-4 pl-10 text-sm transition-colors placeholder:text-muted hover:border-primary/40 focus:border-primary focus:outline-none xl:h-12 xl:pl-13 xl:text-[0.9375rem]"
          >
        </div>
      </div>

      <SubmittedOrdersTable
        v-if="orderPage.orders.length"
        :orders="orderPage.orders"
        show-row-chevron
        class="mt-4 xl:mt-6"
        @select="showOrderDetail"
      />
      <p v-else-if="!isLoading" class="mt-4 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted xl:mt-6 xl:text-lg">
        {{ emptyMessage }}
      </p>

      <PaginationNav v-model="currentPage" :total-pages="totalPages" class="mt-6 xl:mt-8" />
    </section>

    <SubmittedOrderDetailDialog v-model:open="isOrderDetailDialogOpen" :order-id="selectedOrderId" />
  </div>
</template>
