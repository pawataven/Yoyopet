<script setup lang="ts">
import type { TopSpenderEntry, TopSpenderLeaderboard } from '~/types/leaderboard'

const props = defineProps<{
  leaderboard: TopSpenderLeaderboard
}>()

const podiumAppearanceByRank: Record<number, { ringClass: string, avatarClass: string, blockClass: string }> = {
  1: { ringClass: 'border-medal-gold', avatarClass: 'size-18 xl:size-25.5', blockClass: 'h-30 bg-primary text-white xl:h-55' },
  2: { ringClass: 'border-medal-silver', avatarClass: 'size-15 xl:size-21.5', blockClass: 'h-22 bg-primary-soft text-primary-dark xl:h-43.5' },
  3: { ringClass: 'border-medal-bronze', avatarClass: 'size-15 xl:size-21.5', blockClass: 'h-16 bg-primary-soft text-primary-dark xl:h-35' }
}

const PODIUM_ORDER = [2, 1, 3]

const podiumEntries = computed(() =>
  PODIUM_ORDER
    .map(rank => props.leaderboard.entries.find(entry => entry.rank === rank))
    .filter((entry): entry is TopSpenderEntry => Boolean(entry))
)

const monthLabel = computed(() => formatThaiLongMonthYear(props.leaderboard.month))
const daysUntilReset = computed(() => daysUntilEndOf(props.leaderboard.periodEnd))
</script>

<template>
  <section aria-labelledby="top-spender-podium-heading" class="flex flex-col overflow-hidden rounded-[1.25rem] border bg-cream xl:min-h-140">
    <header class="flex items-start justify-between gap-3 px-5 pt-5 xl:px-8 xl:pt-7">
      <h2 id="top-spender-podium-heading" class="font-sans text-lg leading-tight font-semibold xl:text-2xl">
        อันดับเดือน{{ monthLabel }}
      </h2>
      <span
        class="flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold xl:h-8 xl:px-4.5 xl:text-sm"
        :class="leaderboard.isFinal ? 'bg-border text-muted' : 'bg-gold/25 text-pending'"
      >
        {{ leaderboard.isFinal ? 'ปิดอันดับแล้ว' : `รีเซ็ตใน ${formatNumber(daysUntilReset)} วัน` }}
      </span>
    </header>

    <ol class="mt-auto grid grid-cols-3 items-end gap-3 px-4 pt-6 sm:gap-6 xl:gap-15 xl:px-8 xl:pt-4">
      <li
        v-for="entry in podiumEntries"
        :key="entry.rank"
        class="flex flex-col items-center text-center"
      >
        <Icon v-if="entry.rank === 1" name="lucide:crown" class="mb-1 size-6 text-medal-gold xl:mb-2 xl:size-9" aria-hidden="true" />
        <span class="relative">
          <span
            class="flex items-center justify-center rounded-full border-3 bg-white font-sans text-xl font-semibold text-primary-dark xl:border-4 xl:text-[2rem]"
            :class="[podiumAppearanceByRank[entry.rank]?.ringClass, podiumAppearanceByRank[entry.rank]?.avatarClass]"
            aria-hidden="true"
          >
            {{ entry.initial }}
          </span>
          <span
            class="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white font-number text-[0.6875rem] font-semibold xl:size-7.5 xl:text-sm"
            :class="topSpenderMedalClassByRank[entry.rank]"
            aria-hidden="true"
          >
            {{ entry.rank }}
          </span>
        </span>
        <p class="mt-2 w-full truncate text-sm font-semibold xl:mt-3 xl:text-lg">
          <span class="sr-only">อันดับ {{ entry.rank }}</span>
          {{ entry.maskedName }}
        </p>
        <p class="text-sm font-semibold text-primary-dark xl:text-lg">
          {{ formatNumber(entry.totalSpentBaht) }} บาท
        </p>
        <div
          class="mt-3 flex w-full items-center justify-center rounded-t-xl font-number text-2xl font-semibold xl:mt-5 xl:text-[2.5rem]"
          :class="podiumAppearanceByRank[entry.rank]?.blockClass"
          aria-hidden="true"
        >
          {{ entry.rank }}
        </div>
      </li>
    </ol>
  </section>
</template>
