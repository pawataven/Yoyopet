<script setup lang="ts">
import type { TopSpenderMonthWinners } from '~/types/leaderboard'

defineProps<{
  pastWinners: TopSpenderMonthWinners[]
}>()
</script>

<template>
  <section aria-labelledby="top-spender-past-winners-heading" class="mt-12 xl:mt-20">
    <h2 id="top-spender-past-winners-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
      ผู้ชนะเดือนที่ผ่านมา
    </h2>

    <ul class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:mt-6 xl:gap-6">
      <li v-for="monthWinners in pastWinners" :key="monthWinners.month" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
        <h3 class="font-sans text-base font-semibold xl:text-xl">
          {{ formatThaiLongMonthYear(monthWinners.month) }}
        </h3>
        <ol class="mt-3 space-y-2.5 xl:mt-4 xl:space-y-3.5">
          <li v-for="winner in monthWinners.winners" :key="winner.rank" class="flex items-center gap-3 text-sm xl:text-base">
            <span
              class="flex size-5 shrink-0 items-center justify-center rounded-full font-number text-[0.6875rem] font-semibold xl:size-6.5 xl:text-xs"
              :class="topSpenderMedalClassByRank[winner.rank]"
            >
              <span class="sr-only">อันดับ</span>{{ winner.rank }}
            </span>
            <span class="min-w-0 flex-1 truncate">{{ winner.maskedName }}</span>
            <span class="shrink-0 text-muted">{{ formatNumber(winner.totalSpentBaht) }} บาท</span>
          </li>
        </ol>
      </li>
    </ul>
  </section>
</template>
