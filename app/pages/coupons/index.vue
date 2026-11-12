<script setup lang="ts">
import type { MemberCoupon, MemberCouponStatus } from '~/types/coupon'

const RECENT_HISTORY_LIMIT = 2

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'คูปองของฉัน · YoyoPet',
  description: 'คูปองที่แลกไว้ ใช้เป็นส่วนลดตอนสั่งซื้อที่ร้าน YoYo'
})

const { coupons, isLoading } = useMemberCoupons()
const { member } = useMember()
const { rewards } = useRewards()

const statusTabs: { value: MemberCouponStatus, label: string, emptyMessage: string }[] = [
  { value: 'active', label: 'ใช้ได้', emptyMessage: 'ยังไม่มีคูปองที่ใช้ได้' },
  { value: 'used', label: 'ใช้แล้ว', emptyMessage: 'ยังไม่มีคูปองที่ใช้แล้ว' },
  { value: 'expired', label: 'หมดอายุ', emptyMessage: 'ไม่มีคูปองที่หมดอายุ' }
]

const selectedStatus = ref<MemberCouponStatus>('active')
const searchQuery = ref('')

const countByStatus = computed(() => {
  const counts: Record<MemberCouponStatus, number> = { active: 0, used: 0, expired: 0 }
  for (const coupon of coupons.value) counts[coupon.status]++
  return counts
})

const expiringSoonCount = computed(() => coupons.value.filter(coupon => isCouponExpiringSoon(coupon)).length)
const totalSavedBaht = computed(() => coupons.value.reduce((total, coupon) => total + (coupon.redemption?.savedBaht ?? 0), 0))

const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

function matchesSearch(coupon: MemberCoupon) {
  const query = normalizedSearchQuery.value
  return !query || coupon.code.toLowerCase().includes(query) || coupon.title.toLowerCase().includes(query)
}

const visibleCoupons = computed(() =>
  coupons.value.filter(coupon => coupon.status === selectedStatus.value && matchesSearch(coupon))
)

const isRedeemMoreCardVisible = computed(() => selectedStatus.value === 'active' && !normalizedSearchQuery.value)

const emptyMessage = computed(() =>
  normalizedSearchQuery.value
    ? 'ไม่พบคูปองที่ตรงกับคำค้นหา'
    : statusTabs.find(tab => tab.value === selectedStatus.value)!.emptyMessage
)

const recentHistoryCoupons = computed(() =>
  coupons.value
    .filter(coupon => coupon.status !== 'active')
    .toSorted((a, b) => couponClosedAt(b).localeCompare(couponClosedAt(a)))
    .slice(0, RECENT_HISTORY_LIMIT)
)

const memberPoints = computed(() => member.value?.points ?? 0)
const redeemableRewardCount = computed(() => rewards.value.filter(reward => reward.pointsCost <= memberPoints.value).length)

const couponListSection = useTemplateRef('couponListSection')

function showAllCouponHistory() {
  selectedStatus.value = 'used'
  searchQuery.value = ''
  couponListSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToUsageGuide() {
  document.getElementById('coupon-usage-guide')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const searchInputId = useId()
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="คูปองของฉัน" />

    <header class="mt-3 flex flex-wrap items-end justify-between gap-4 xl:mt-4">
      <div>
        <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
          คูปองของฉัน
        </h1>
        <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
          คูปองที่แลกไว้ ใช้เป็นส่วนลดตอนสั่งซื้อที่ร้าน YoYo
        </p>
      </div>
      <NuxtLink
        to="/rewards"
        class="flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:mb-2 xl:h-14 xl:px-14 xl:text-base"
      >
        แลกคูปองเพิ่ม
      </NuxtLink>
    </header>

    <CouponSummaryCards
      :active-count="countByStatus.active"
      :expiring-soon-count="expiringSoonCount"
      :total-saved-baht="totalSavedBaht"
    />

    <section ref="couponListSection" aria-label="รายการคูปอง" class="mt-8 scroll-mt-24 xl:mt-14">
      <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b">
        <fieldset>
          <legend class="sr-only">
            สถานะคูปอง
          </legend>
          <div class="flex xl:gap-8 2xl:gap-12">
            <label
              v-for="tab in statusTabs"
              :key="tab.value"
              class="group relative flex h-11 cursor-pointer items-center gap-2 pr-5 font-heading text-sm font-medium text-ink transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary after:opacity-0 hover:text-primary-dark has-checked:text-primary-dark has-checked:after:opacity-100 has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-14 xl:min-w-41 xl:gap-4 xl:pr-8 xl:text-xl"
            >
              <input
                v-model="selectedStatus"
                type="radio"
                name="coupon-status"
                :value="tab.value"
                class="sr-only"
              >
              {{ tab.label }}
              <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-border px-1.5 font-number text-xs font-semibold text-muted group-has-checked:bg-primary-soft group-has-checked:text-primary-dark xl:h-6.5 xl:min-w-6.5 xl:text-sm">
                {{ formatNumber(countByStatus[tab.value]) }}
              </span>
            </label>
          </div>
        </fieldset>

        <div class="relative mb-2 w-full sm:w-64 xl:mb-3 xl:w-88">
          <label :for="searchInputId" class="sr-only">ค้นหาโค้ดคูปอง</label>
          <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted xl:left-5 xl:size-5" />
          <input
            :id="searchInputId"
            v-model="searchQuery"
            type="search"
            placeholder="ค้นหาโค้ดคูปอง"
            class="h-10 w-full rounded-full border bg-white pr-4 pl-10 text-sm transition-colors placeholder:text-muted hover:border-primary/40 focus:border-primary focus:outline-none xl:h-12 xl:pl-13 xl:text-[0.9375rem]"
          >
        </div>
      </div>

      <ul v-if="visibleCoupons.length || isRedeemMoreCardVisible" class="mt-5 grid gap-4 lg:grid-cols-2 xl:mt-6 xl:gap-6">
        <li v-for="coupon in visibleCoupons" :key="coupon.id" class="flex">
          <CouponListCard :coupon="coupon" class="w-full" @apply="scrollToUsageGuide" />
        </li>
        <li v-if="isRedeemMoreCardVisible">
          <RedeemMoreCouponsCard :points="memberPoints" :redeemable-reward-count="redeemableRewardCount" />
        </li>
      </ul>
      <p v-else-if="!isLoading" class="mt-5 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted xl:mt-6 xl:text-lg">
        {{ emptyMessage }}
      </p>
    </section>

    <section v-if="recentHistoryCoupons.length" aria-labelledby="recent-coupon-history-heading" class="mt-12 xl:mt-20">
      <div class="flex items-center justify-between gap-4">
        <h2 id="recent-coupon-history-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
          ใช้แล้ว / หมดอายุล่าสุด
        </h2>
        <button type="button" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg" @click="showAllCouponHistory">
          ดูทั้งหมด ›
        </button>
      </div>
      <ul class="mt-4 grid gap-4 lg:grid-cols-2 xl:mt-6 xl:gap-6">
        <li v-for="coupon in recentHistoryCoupons" :key="coupon.id" class="flex">
          <CouponListCard :coupon="coupon" class="w-full" />
        </li>
      </ul>
    </section>

    <CouponUsageGuide />
    <CouponTermsNote />
  </div>
</template>
