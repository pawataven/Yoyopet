<script setup lang="ts">
import type { TopSpenderPrize } from '~/types/leaderboard'

defineProps<{
  prizes: TopSpenderPrize[]
  month: string
  resultAnnouncedOn: string
  isFinal: boolean
}>()

const emit = defineEmits<{
  shop: []
}>()

const selectedPrize = ref<TopSpenderPrize | null>(null)
const isPrizeDialogOpen = ref(false)

function openPrizeDialog(prize: TopSpenderPrize) {
  selectedPrize.value = prize
  isPrizeDialogOpen.value = true
}

function shopFromPrizeDialog() {
  isPrizeDialogOpen.value = false
  emit('shop')
}
</script>

<template>
  <section aria-labelledby="top-spender-prizes-heading" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
    <h2 id="top-spender-prizes-heading" class="font-sans text-lg leading-tight font-semibold xl:text-2xl">
      {{ isFinal ? 'ของรางวัลประจำเดือน' : 'ของรางวัลเดือนนี้' }}
    </h2>

    <ol class="mt-3 xl:mt-5">
      <li v-for="prize in prizes" :key="prize.rank" class="border-b last:border-b-0">
        <button
          type="button"
          class="group flex w-full items-center gap-4 rounded-xl py-3 text-left focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none xl:gap-6 xl:py-4"
          @click="openPrizeDialog(prize)"
        >
          <span class="relative shrink-0">
            <NuxtImg
              :src="prize.imageUrl"
              alt=""
              width="216"
              height="144"
              class="size-16 rounded-xl object-cover xl:size-29"
            />
            <span
              class="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white font-number text-[0.6875rem] font-semibold xl:size-7.5 xl:text-sm"
              :class="topSpenderMedalClassByRank[prize.rank]"
              aria-hidden="true"
            >
              {{ prize.rank }}
            </span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-xs font-semibold xl:text-sm">
              อันดับ {{ prize.rank }}
            </span>
            <span class="block text-sm font-semibold transition-colors group-hover:text-primary-dark xl:text-lg">
              {{ prize.name }}
            </span>
            <span class="mt-0.5 block text-xs font-medium text-primary-dark xl:mt-1 xl:text-sm">
              + คูปองส่วนลด {{ formatNumber(prize.bonusCouponBaht) }} บาท
            </span>
          </span>
          <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
        </button>
      </li>
    </ol>

    <TopSpenderPrizeDialog
      v-if="selectedPrize"
      v-model:open="isPrizeDialogOpen"
      :prize="selectedPrize"
      :month="month"
      :result-announced-on="resultAnnouncedOn"
      :is-final="isFinal"
      @shop="shopFromPrizeDialog"
    />
  </section>
</template>
