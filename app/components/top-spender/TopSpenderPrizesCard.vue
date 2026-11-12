<script setup lang="ts">
import type { TopSpenderPrize } from '~/types/leaderboard'

defineProps<{
  prizes: TopSpenderPrize[]
  isFinal: boolean
}>()
</script>

<template>
  <section aria-labelledby="top-spender-prizes-heading" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
    <h2 id="top-spender-prizes-heading" class="text-lg leading-tight xl:text-2xl">
      {{ isFinal ? 'ของรางวัลประจำเดือน' : 'ของรางวัลเดือนนี้' }}
    </h2>

    <ol class="mt-3 xl:mt-5">
      <li v-for="prize in prizes" :key="prize.rank" class="flex items-center gap-4 border-b py-3 last:border-b-0 xl:gap-6 xl:py-4">
        <span class="relative shrink-0">
          <NuxtImg
            :src="prize.imageUrl"
            alt=""
            width="216"
            height="144"
            class="size-16 rounded-xl border object-cover xl:size-29"
          />
          <span
            class="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white font-number text-[0.6875rem] font-semibold xl:size-7.5 xl:text-sm"
            :class="topSpenderMedalClassByRank[prize.rank]"
            aria-hidden="true"
          >
            {{ prize.rank }}
          </span>
        </span>
        <div class="min-w-0">
          <p class="text-xs text-muted xl:text-sm">
            อันดับ {{ prize.rank }}
          </p>
          <p class="text-sm font-semibold xl:text-lg">
            {{ prize.name }}
          </p>
          <p class="mt-0.5 text-xs font-medium text-primary-dark xl:mt-1 xl:text-sm">
            + คูปองส่วนลด {{ formatNumber(prize.bonusCouponBaht) }} บาท
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>
