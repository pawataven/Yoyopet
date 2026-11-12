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

const { pendingClaim, shouldPromptClaim, postponeClaim, refresh: refreshPendingClaim } = useTopSpenderPrizeClaim()
const isPrizeClaimDialogOpen = ref(false)
const isShopDialogOpen = ref(false)
watch(shouldPromptClaim, (shouldPrompt) => {
  if (shouldPrompt) isPrizeClaimDialogOpen.value = true
}, { immediate: true })

const monthOptions = computed(() => months.value.map((month, index) => ({
  value: month,
  label: formatThaiLongMonthYear(month),
  description: index === 0 ? 'กำลังแข่งขัน' : 'ประกาศผลแล้ว'
})))
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

      <SelectMenu
        v-if="months.length"
        v-model="selectedMonth"
        :options="monthOptions"
        icon="lucide:calendar"
        label="เลือกเดือน"
        class="w-60 xl:mb-2 xl:w-75"
      />
    </header>

    <template v-if="leaderboard">
      <div class="mt-6 grid grid-cols-1 gap-6 xl:mt-10 xl:grid-cols-[minmax(0,972fr)_minmax(0,684fr)]">
        <TopSpenderPodium :leaderboard="leaderboard" />
        <TopSpenderPrizesCard
          :prizes="leaderboard.prizes"
          :month="leaderboard.month"
          :result-announced-on="leaderboard.resultAnnouncedOn"
          :is-final="leaderboard.isFinal"
          @shop="isShopDialogOpen = true"
        />
      </div>

      <div class="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1112fr)_minmax(0,544fr)]">
        <TopSpenderRankingTable
          :entries="leaderboard.entries"
          :rewarded-rank-count="leaderboard.rewardedRankCount"
          :my-standing="leaderboard.myStanding"
          :member-display-name="member?.displayName ?? null"
          :member-tier="member?.tier ?? null"
        />
        <div class="grid grid-cols-1 gap-6">
          <MyTopSpenderStandingCard
            v-if="leaderboard.myStanding"
            :standing="leaderboard.myStanding"
            :is-final="leaderboard.isFinal"
            @shop="isShopDialogOpen = true"
          />
          <TopSpenderRulesCard />
        </div>
      </div>
    </template>

    <TopSpenderPastWinners v-if="pastWinners.length" :past-winners="pastWinners" />

    <TopSpenderPrizeClaimDialog
      v-if="pendingClaim && member"
      v-model:open="isPrizeClaimDialogOpen"
      :claim="pendingClaim"
      :member-display-name="member.displayName"
      @postponed="postponeClaim"
      @confirmed="refreshPendingClaim"
    />

    <ShopMarketplacesDialog v-model:open="isShopDialogOpen" />
  </div>
</template>
