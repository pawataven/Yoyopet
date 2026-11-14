<script setup lang="ts">
import type { TopSpenderLeaderboard } from '~/types/leaderboard'

const props = defineProps<{
  leaderboard: TopSpenderLeaderboard
  memberDisplayName: string | null
}>()

const rewardedEntries = computed(() => props.leaderboard.entries.slice(0, props.leaderboard.rewardedRankCount))
const monthLabel = computed(() => formatThaiShortMonth(props.leaderboard.periodEnd))
const daysUntilReset = computed(() => daysUntilEndOf(props.leaderboard.periodEnd))
</script>

<template>
  <section aria-labelledby="top-spender-mobile-heading" class="rounded-[1.25rem] border bg-white p-3.5">
    <header class="flex items-start gap-2.5">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-pending">
        <Icon name="lucide:trophy" class="size-4.5" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 id="top-spender-mobile-heading" class="text-lg leading-tight">
          <NuxtLink to="/top-spender" class="hover:text-primary-dark">
            Top Spender เดือน {{ monthLabel }}
          </NuxtLink>
        </h2>
        <p class="mt-0.5 text-xs text-muted">
          ยอดซื้อสูงสุด {{ leaderboard.rewardedRankCount }} อันดับแรก รับของรางวัล
        </p>
      </div>
      <span class="flex h-5.5 shrink-0 items-center rounded-full bg-gold/20 px-2.5 text-xs font-semibold text-pending">
        เหลือ {{ formatNumber(daysUntilReset) }} วัน
      </span>
    </header>

    <ol class="mt-3">
      <li v-for="entry in rewardedEntries" :key="entry.rank" class="flex h-10 items-center gap-2.5 px-2">
        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-full font-number text-xs font-semibold"
          :class="topSpenderMedalClassByRank[entry.rank] ?? 'bg-border/70 text-muted'"
        >
          {{ entry.rank }}
        </span>
        <span class="min-w-0 flex-1 truncate">{{ entry.maskedName }}</span>
        <span class="shrink-0 font-semibold">
          <span class="font-number">{{ formatNumber(entry.totalSpentBaht) }}</span> บาท
        </span>
      </li>
    </ol>

    <div v-if="leaderboard.myStanding" class="mt-3 flex items-center gap-3 rounded-2xl bg-primary-soft px-3.5 py-2.5">
      <span class="shrink-0 font-number text-base font-semibold text-primary-dark">#{{ leaderboard.myStanding.rank }}</span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold">
          คุณ{{ memberDisplayName }} (คุณ)
        </p>
        <p v-if="leaderboard.myStanding.amountToTargetBaht > 0" class="truncate text-xs text-muted">
          อีก {{ formatNumber(leaderboard.myStanding.amountToTargetBaht) }} บาท ติด Top {{ leaderboard.myStanding.targetRank }}
        </p>
      </div>
      <span class="shrink-0 text-sm font-semibold">
        <span class="font-number">{{ formatNumber(leaderboard.myStanding.totalSpentBaht) }}</span> บาท
      </span>
    </div>
  </section>
</template>
