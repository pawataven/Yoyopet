<script setup lang="ts">
import type { Reward, RewardGroup } from '~/types/reward'

type RewardSortOrder = 'points_asc' | 'points_desc'

const POINT_RANGE_ROUNDING = 1000
const REWARDS_PAGE_SIZE = 12

// TODO: confirm the final redemption terms with the business team
const redemptionTerms = [
  'แลกแล้วยกเลิกหรือคืนแต้มไม่ได้',
  'คูปองมีอายุ 30 วันหลังแลก',
  'สินค้ามีจำนวนจำกัด',
  'บริษัทขอสงวนสิทธิ์เปลี่ยนแปลงของรางวัลโดยไม่ต้องแจ้งล่วงหน้า'
]

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'ของรางวัล · YoyoPet',
  description: 'ใช้แต้มแลกคูปองส่วนลดและสินค้า YoYo ได้ทุกวัน'
})

const { member } = useMember()
const { dashboard } = useMemberDashboard()
const { rewards } = useRewards()

const sortOptions: { value: RewardSortOrder, label: string }[] = [
  { value: 'points_asc', label: 'แต้มน้อยไปมาก' },
  { value: 'points_desc', label: 'แต้มมากไปน้อย' }
]

const memberPoints = computed(() => member.value?.points ?? 0)

const pointRangeMax = computed(() => {
  const highestCost = Math.max(0, ...rewards.value.map(reward => reward.pointsCost))
  return Math.max(POINT_RANGE_ROUNDING, Math.ceil(highestCost / POINT_RANGE_ROUNDING) * POINT_RANGE_ROUNDING)
})

const isRedeemableOnly = ref(false)
const minPoints = ref(0)
// null means "no upper limit", so the slider stays at the end while the catalog (and its max) is still loading
const maxPointsSelection = ref<number | null>(null)
const maxPoints = computed({
  get: () => Math.min(maxPointsSelection.value ?? pointRangeMax.value, pointRangeMax.value),
  set: (value: number) => {
    maxPointsSelection.value = value >= pointRangeMax.value ? null : value
  }
})
const selectedGroups = ref<RewardGroup[]>([])
const sortOrder = ref<RewardSortOrder>('points_asc')

const countByGroup = computed(() => {
  const counts = Object.fromEntries(rewardGroupOrder.map(group => [group, 0])) as Record<RewardGroup, number>
  for (const reward of rewards.value) counts[reward.group]++
  return counts
})

// The chip row is a shortcut for the same group filter as the sidebar checkboxes
const activeGroupChip = computed<RewardGroup | 'all' | null>(() => {
  if (selectedGroups.value.length === 0) return 'all'
  return selectedGroups.value.length === 1 ? selectedGroups.value[0]! : null
})

const groupChips: { value: RewardGroup | 'all', label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  ...rewardGroupOrder.map(group => ({ value: group, label: rewardGroupLabels[group] }))
]

function selectGroupChip(group: RewardGroup | 'all') {
  selectedGroups.value = group === 'all' ? [] : [group]
}

function matchesFilters(reward: Reward) {
  if (isRedeemableOnly.value && reward.pointsCost > memberPoints.value) return false
  if (reward.pointsCost < minPoints.value || reward.pointsCost > maxPoints.value) return false
  if (selectedGroups.value.length && !selectedGroups.value.includes(reward.group)) return false
  return true
}

const visibleRewards = computed(() =>
  rewards.value
    .filter(matchesFilters)
    .toSorted((a, b) => (sortOrder.value === 'points_asc' ? a.pointsCost - b.pointsCost : b.pointsCost - a.pointsCost))
)

const shownRewardCount = ref(REWARDS_PAGE_SIZE)
const shownRewards = computed(() => visibleRewards.value.slice(0, shownRewardCount.value))
const hasMoreRewards = computed(() => shownRewards.value.length < visibleRewards.value.length)

watch([isRedeemableOnly, minPoints, maxPoints, selectedGroups, sortOrder], () => {
  shownRewardCount.value = REWARDS_PAGE_SIZE
}, { deep: true })

function showMoreRewards() {
  shownRewardCount.value += REWARDS_PAGE_SIZE
}

const sortSelectId = useId()
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="ของรางวัล" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        ของรางวัล
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        ใช้แต้มแลกคูปองส่วนลดและสินค้า YoYo ได้ทุกวัน
      </p>
    </header>

    <RewardsPointsBanner
      v-if="member && dashboard"
      :points="member.points"
      :tier-progress="dashboard.tierProgress"
      :expiring-points="dashboard.expiringPoints"
    />

    <div class="mt-8 grid items-start gap-6 xl:mt-17 xl:grid-cols-[25rem_minmax(0,1fr)]">
      <div class="space-y-6 xl:space-y-8">
        <RewardFilterPanel
          v-model:redeemable-only="isRedeemableOnly"
          v-model:min-points="minPoints"
          v-model:max-points-filter="maxPoints"
          v-model:groups="selectedGroups"
          :max-points="pointRangeMax"
          :count-by-group="countByGroup"
        />
        <RecentRedemptionsCard class="hidden xl:block" />
      </div>

      <section aria-labelledby="all-rewards-heading">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-baseline gap-3 xl:gap-6">
            <h2 id="all-rewards-heading" class="text-xl leading-tight xl:text-[2rem]">
              ของรางวัลทั้งหมด
            </h2>
            <p class="text-sm text-muted xl:text-[0.9375rem]">
              {{ formatNumber(visibleRewards.length) }} รายการ
            </p>
          </div>

          <div class="relative">
            <label :for="sortSelectId" class="sr-only">เรียงตาม</label>
            <select
              :id="sortSelectId"
              v-model="sortOrder"
              class="h-11 cursor-pointer appearance-none rounded-full border bg-white pr-12 pl-5 text-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none xl:h-12 xl:w-76 xl:pl-6 xl:text-[0.9375rem]"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                เรียงตาม: {{ option.label }}
              </option>
            </select>
            <Icon name="lucide:chevron-down" class="pointer-events-none absolute top-1/2 right-5 size-4.5 -translate-y-1/2" />
          </div>
        </div>

        <div role="group" aria-label="กรองตามประเภท" class="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0 xl:mt-5 xl:gap-3.5">
          <button
            v-for="chip in groupChips"
            :key="chip.value"
            type="button"
            :aria-pressed="activeGroupChip === chip.value"
            class="h-10 shrink-0 rounded-full border px-4 text-sm whitespace-nowrap transition-colors xl:h-11 xl:px-6 xl:text-[0.9375rem]"
            :class="activeGroupChip === chip.value
              ? 'border-primary bg-primary font-semibold text-white'
              : 'bg-white text-ink hover:border-primary hover:text-primary'"
            @click="selectGroupChip(chip.value)"
          >
            {{ chip.label }}
          </button>
        </div>

        <ul v-if="visibleRewards.length" class="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:mt-6 xl:gap-x-8 xl:gap-y-6">
          <li v-for="reward in shownRewards" :key="reward.id" class="flex">
            <RewardCard :reward="reward" :member-points="memberPoints" variant="catalog" class="w-full" />
          </li>
        </ul>
        <div v-if="visibleRewards.length" class="mt-6 flex flex-col items-center gap-3 xl:mt-8 xl:gap-4">
          <p class="text-xs text-muted xl:text-sm" aria-live="polite">
            แสดง {{ formatNumber(shownRewards.length) }} จาก {{ formatNumber(visibleRewards.length) }} รายการ
          </p>
          <button
            v-if="hasMoreRewards"
            type="button"
            class="flex h-11 w-48 items-center justify-center rounded-xl border-2 border-primary text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-14 xl:w-60 xl:text-base"
            @click="showMoreRewards"
          >
            ดูเพิ่มเติม
          </button>
        </div>
        <p v-else class="mt-5 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted xl:mt-6 xl:text-lg">
          ไม่พบของรางวัลที่ตรงกับตัวกรอง
        </p>
      </section>
    </div>

    <RecentRedemptionsCard class="mt-8 xl:hidden" />

    <RewardRedemptionSteps />
    <TermsNote title="เงื่อนไขการแลก" :terms="redemptionTerms" class="mt-6 xl:mt-10" />
  </div>
</template>
