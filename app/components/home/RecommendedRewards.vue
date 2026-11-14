<script setup lang="ts">
import type { Reward } from '~/types/reward'

type RewardFilter = 'all' | 'coupon' | 'product' | 'privilege' | 'redeemable'

const rewardFilters: { value: RewardFilter, label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'coupon', label: 'คูปองส่วนลด' },
  { value: 'product', label: 'สินค้า' },
  { value: 'privilege', label: 'สิทธิพิเศษ' },
  { value: 'redeemable', label: 'แลกได้ตอนนี้' }
]

const { rewards } = useRecommendedRewards()
const { member } = useMember()

const activeFilter = ref<RewardFilter>('all')
const memberPoints = computed(() => member.value?.points ?? 0)

function matchesFilter(reward: Reward, filter: RewardFilter) {
  if (filter === 'all') return true
  if (filter === 'redeemable') return reward.pointsCost <= memberPoints.value
  return reward.category === filter
}

const visibleRewards = computed(() => rewards.value.filter(reward => matchesFilter(reward, activeFilter.value)))
</script>

<template>
  <section v-if="rewards.length" aria-labelledby="recommended-rewards-heading" class="page-container mt-7 md:mt-12 xl:mt-20">
    <div class="flex items-center justify-between gap-4">
      <h2 id="recommended-rewards-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
        ของรางวัลแนะนำ
      </h2>
      <NuxtLink to="/rewards" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-base">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <ul class="-mx-4 mt-3 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 scrollbar-none md:hidden">
      <li v-for="reward in rewards" :key="reward.id" class="flex w-39 shrink-0 snap-start">
        <RewardCarouselCard :reward="reward" :member-points="memberPoints" class="w-full" />
      </li>
    </ul>

    <div role="group" aria-label="กรองของรางวัล" class="mt-4 flex gap-2 overflow-x-auto scrollbar-none max-md:hidden xl:gap-3">
      <button
        v-for="filter in rewardFilters"
        :key="filter.value"
        type="button"
        :aria-pressed="activeFilter === filter.value"
        class="h-9 shrink-0 rounded-full border px-4 text-sm whitespace-nowrap transition-colors xl:h-11.5 xl:px-6 xl:text-base"
        :class="activeFilter === filter.value
          ? 'border-primary bg-primary font-semibold text-white'
          : 'bg-white text-ink hover:border-primary hover:text-primary'"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <ul v-if="visibleRewards.length" class="mt-6 grid grid-cols-2 gap-3 max-md:hidden lg:grid-cols-4 xl:mt-8 xl:gap-6">
      <li v-for="reward in visibleRewards" :key="reward.id" class="flex">
        <RewardCard :reward="reward" :member-points="memberPoints" class="w-full" />
      </li>
    </ul>
    <p v-else class="mt-6 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted max-md:hidden xl:mt-8 xl:text-lg">
      ยังไม่มีของรางวัลในหมวดนี้
    </p>
  </section>
</template>
