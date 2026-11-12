<script setup lang="ts">
import type { MyTopSpenderStanding, TopSpenderEntry } from '~/types/leaderboard'

const props = defineProps<{
  entries: TopSpenderEntry[]
  rewardedRankCount: number
  myStanding: MyTopSpenderStanding | null
  memberDisplayName: string | null
  memberTier: string | null
}>()

const rankedEntries = computed(() => props.entries.filter(entry => entry.rank > props.rewardedRankCount))
const rankRangeLabel = computed(() => {
  const ranks = rankedEntries.value.map(entry => entry.rank)
  return ranks.length ? `${Math.min(...ranks)}–${Math.max(...ranks)}` : ''
})
// Members already listed above don't need a second "you" row
const isMyRowVisible = computed(() =>
  props.myStanding !== null && !rankedEntries.value.some(entry => entry.rank === props.myStanding!.rank)
)

const cellClass = 'px-2 xl:px-3'
const tierBadgeClass = 'inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap xl:h-7 xl:px-4 xl:text-[0.8125rem]'
</script>

<template>
  <section aria-labelledby="top-spender-ranking-heading" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
    <h2 id="top-spender-ranking-heading" class="font-sans text-lg leading-tight font-semibold xl:text-2xl">
      อันดับ {{ rankRangeLabel }}
    </h2>

    <table class="mt-3 w-full border-separate border-spacing-0 text-sm xl:mt-5 xl:text-base">
      <thead>
        <tr class="text-left text-xs text-muted xl:text-sm">
          <th scope="col" :class="cellClass" class="w-12 border-b pb-2 font-normal xl:w-16 xl:pb-3">
            อันดับ
          </th>
          <th scope="col" :class="cellClass" class="border-b pb-2 font-normal xl:pb-3">
            สมาชิก
          </th>
          <th scope="col" :class="cellClass" class="hidden border-b pb-2 font-normal sm:table-cell xl:w-[30%] xl:pb-3">
            ระดับ
          </th>
          <th scope="col" :class="cellClass" class="border-b pb-2 text-right font-normal xl:pb-3">
            ยอดซื้อสะสม
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in rankedEntries" :key="entry.rank">
          <td :class="cellClass" class="h-13 border-b font-semibold xl:h-15">
            {{ entry.rank }}
          </td>
          <td :class="cellClass" class="border-b">
            <span class="flex items-center gap-3 xl:gap-4">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-dark xl:size-9 xl:text-sm" aria-hidden="true">
                {{ entry.initial }}
              </span>
              <span class="truncate">{{ entry.maskedName }}</span>
            </span>
          </td>
          <td :class="cellClass" class="hidden border-b sm:table-cell">
            <span :class="[tierBadgeClass, tierBadgeClassByName[entry.tier] ?? 'bg-border text-muted']">{{ entry.tier }}</span>
          </td>
          <td :class="cellClass" class="border-b text-right font-semibold whitespace-nowrap">
            {{ formatNumber(entry.totalSpentBaht) }} บาท
          </td>
        </tr>
      </tbody>
      <tfoot v-if="isMyRowVisible && myStanding">
        <tr class="bg-primary-soft">
          <td :class="cellClass" class="h-16 rounded-l-xl font-semibold text-primary-dark xl:h-18">
            {{ myStanding.rank }}
          </td>
          <td :class="cellClass">
            <span class="flex items-center gap-3 xl:gap-4">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary-dark xl:size-9 xl:text-sm" aria-hidden="true">
                {{ memberDisplayName?.charAt(0) }}
              </span>
              <span class="min-w-0">
                <span class="block truncate font-semibold">คุณ{{ memberDisplayName }} (คุณ)</span>
                <span v-if="myStanding.amountToTargetBaht > 0" class="block text-xs text-muted xl:text-[0.8125rem]">
                  อีก {{ formatNumber(myStanding.amountToTargetBaht) }} บาท ติด Top {{ myStanding.targetRank }}
                </span>
              </span>
            </span>
          </td>
          <td :class="cellClass" class="hidden sm:table-cell">
            <span v-if="memberTier" :class="[tierBadgeClass, tierBadgeClassByName[memberTier] ?? 'bg-border text-muted']">{{ memberTier }}</span>
          </td>
          <td :class="cellClass" class="rounded-r-xl text-right font-semibold whitespace-nowrap">
            {{ formatNumber(myStanding.totalSpentBaht) }} บาท
          </td>
        </tr>
      </tfoot>
    </table>
  </section>
</template>
