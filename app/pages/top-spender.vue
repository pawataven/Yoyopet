<script setup lang="ts">
useSeoMeta({
  title: 'Top Spender · YoyoPet',
  description: 'จัดอันดับยอดซื้อสูงสุดประจำเดือน 3 อันดับแรกรับของรางวัลพิเศษ'
})

const { months } = useTopSpenderMonths()
// null follows the month that is still running, so it shares cached data with the home page card
const selectedPastMonth = ref<string | null>(null)
const selectedMonth = computed({
  get: () => selectedPastMonth.value ?? months.value[0] ?? '',
  set: (month: string) => {
    selectedPastMonth.value = month === months.value[0] ? null : month
  }
})

const { leaderboard } = useTopSpenderLeaderboard(selectedPastMonth)
const { pastWinners } = useTopSpenderPastWinners()
const { member } = useMember()

const monthSelectId = useId()
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="Top Spender" />

    <header class="mt-3 flex flex-wrap items-end justify-between gap-4 xl:mt-4">
      <div>
        <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
          Top Spender
        </h1>
        <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
          จัดอันดับยอดซื้อสูงสุดประจำเดือน {{ leaderboard?.rewardedRankCount ?? 3 }} อันดับแรกรับของรางวัลพิเศษ
        </p>
      </div>

      <div v-if="months.length" class="relative xl:mb-2">
        <label :for="monthSelectId" class="sr-only">เลือกเดือน</label>
        <Icon name="lucide:calendar" class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 xl:left-5 xl:size-5" />
        <select
          :id="monthSelectId"
          v-model="selectedMonth"
          class="h-11 cursor-pointer appearance-none rounded-full border bg-white pr-12 pl-11 text-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none xl:h-12 xl:w-75 xl:pl-13 xl:text-[0.9375rem]"
        >
          <option v-for="month in months" :key="month" :value="month">
            {{ formatThaiLongMonthYear(month) }}
          </option>
        </select>
        <Icon name="lucide:chevron-down" class="pointer-events-none absolute top-1/2 right-5 size-4.5 -translate-y-1/2" />
      </div>
    </header>

    <template v-if="leaderboard">
      <div class="mt-6 grid gap-6 xl:mt-10 xl:grid-cols-[972fr_684fr]">
        <TopSpenderPodium :leaderboard="leaderboard" />
        <TopSpenderPrizesCard :prizes="leaderboard.prizes" :is-final="leaderboard.isFinal" />
      </div>

      <div class="mt-6 grid items-start gap-6 xl:grid-cols-[1112fr_544fr]">
        <TopSpenderRankingTable
          :entries="leaderboard.entries"
          :rewarded-rank-count="leaderboard.rewardedRankCount"
          :my-standing="leaderboard.myStanding"
          :member-display-name="member?.displayName ?? null"
          :member-tier="member?.tier ?? null"
        />
        <div class="grid gap-6">
          <MyTopSpenderStandingCard
            v-if="leaderboard.myStanding"
            :standing="leaderboard.myStanding"
            :is-final="leaderboard.isFinal"
          />
          <TopSpenderRulesCard />
        </div>
      </div>
    </template>

    <TopSpenderPastWinners v-if="pastWinners.length" :past-winners="pastWinners" />
  </div>
</template>
