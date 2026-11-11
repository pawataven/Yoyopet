<script setup lang="ts">
const { member } = useMember()
const { dashboard } = useMemberDashboard()
const { leaderboard } = useTopSpenderLeaderboard()
const { tierLevels } = useTierLevels()
</script>

<template>
  <div class="page-container mt-12 grid gap-6 xl:mt-20 xl:grid-cols-[972fr_684fr]">
    <TopSpenderCard
      v-if="leaderboard"
      :leaderboard="leaderboard"
      :member-display-name="member?.displayName ?? null"
    />
    <MemberTierCard
      v-if="dashboard && tierLevels.length"
      :tier-levels="tierLevels"
      :tier-progress="dashboard.tierProgress"
    />
  </div>
</template>
