<script setup lang="ts">
import type { TopSpenderLeaderboard } from '~/types/leaderboard'

const props = defineProps<{
  leaderboard: TopSpenderLeaderboard
  memberDisplayName: string | null
}>()

const PREVIEW_ENTRY_COUNT = 5

const previewEntries = computed(() => props.leaderboard.entries.slice(0, PREVIEW_ENTRY_COUNT))
const monthLabel = computed(() => formatThaiShortMonth(props.leaderboard.periodEnd))
const daysUntilReset = computed(() => daysUntilEndOf(props.leaderboard.periodEnd))
</script>

<template>
  <section aria-labelledby="top-spender-heading" class="flex flex-col rounded-[1.25rem] border bg-white p-5 xl:p-8">
    <header class="flex items-start gap-3 xl:gap-4 xl:px-1">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-dark xl:size-14">
        <Icon name="lucide:trophy" class="size-5 xl:size-6" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 id="top-spender-heading" class="text-lg leading-tight xl:text-[1.75rem]">
          Top Spender ประจำเดือน {{ monthLabel }}
        </h2>
        <p class="mt-1 text-xs text-muted xl:text-[1.0625rem]">
          ยอดซื้อสูงสุด {{ leaderboard.rewardedRankCount }} อันดับแรก รับของรางวัลพิเศษทุกเดือน
        </p>
      </div>
      <span class="flex h-7 shrink-0 items-center rounded-full bg-gold/20 px-3 text-xs font-semibold text-pending xl:mt-1 xl:h-8 xl:px-5 xl:text-base">
        รีเซ็ตใน {{ formatNumber(daysUntilReset) }} วัน
      </span>
    </header>

    <ol class="mt-4 flex-1 xl:mt-7.5">
      <li
        v-for="entry in previewEntries"
        :key="entry.rank"
        class="flex h-12 items-center gap-3 border-b px-2 last:border-b-0 xl:h-14 xl:gap-4 xl:px-4"
      >
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold xl:size-9 xl:text-sm"
          :class="topSpenderMedalClassByRank[entry.rank] ??'bg-border/70 text-muted'"
        >
          {{ entry.rank }}
        </span>
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-dark xl:size-10 xl:text-sm" aria-hidden="true">
          {{ entry.initial }}
        </span>
        <span class="min-w-0 flex-1 truncate text-sm xl:text-lg">{{ entry.maskedName }}</span>
        <span class="shrink-0 text-sm font-semibold xl:text-lg">{{ formatNumber(entry.totalSpentBaht) }} บาท</span>
      </li>
    </ol>

    <div
      v-if="leaderboard.myStanding"
      class="mt-3 flex items-center gap-3 rounded-2xl bg-primary-soft px-2 py-3 xl:mt-4 xl:gap-4 xl:px-4 xl:py-3.5"
    >
      <span class="w-7 shrink-0 text-sm font-semibold text-primary-dark xl:w-9 xl:text-base">#{{ leaderboard.myStanding.rank }}</span>
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary-dark xl:size-10 xl:text-sm" aria-hidden="true">
        {{ memberDisplayName?.charAt(0) }}
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold xl:text-lg">
          คุณ{{ memberDisplayName }} (คุณ)
        </p>
        <p v-if="leaderboard.myStanding.amountToTargetBaht > 0" class="text-xs text-muted xl:text-[0.9375rem]">
          อีก {{ formatNumber(leaderboard.myStanding.amountToTargetBaht) }} บาท ติด Top {{ leaderboard.myStanding.targetRank }}
        </p>
      </div>
      <span class="shrink-0 text-sm font-semibold xl:text-lg">{{ formatNumber(leaderboard.myStanding.totalSpentBaht) }} บาท</span>
    </div>
  </section>
</template>
