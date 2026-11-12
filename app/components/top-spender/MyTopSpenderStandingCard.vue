<script setup lang="ts">
import type { MyTopSpenderStanding } from '~/types/leaderboard'

const props = defineProps<{
  standing: MyTopSpenderStanding
  isFinal: boolean
}>()

const emit = defineEmits<{
  shop: []
}>()

const isInTargetRank = computed(() => props.standing.rank <= props.standing.targetRank)
const progressPercent = computed(() => {
  const target = props.standing.totalSpentBaht + props.standing.amountToTargetBaht
  return target > 0 ? Math.min(100, Math.round((props.standing.totalSpentBaht / target) * 100)) : 100
})
</script>

<template>
  <section aria-labelledby="my-top-spender-standing-heading" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
    <h2 id="my-top-spender-standing-heading" class="font-sans text-lg leading-tight font-semibold xl:text-2xl">
      อันดับของคุณ
    </h2>

    <div class="mt-3 flex items-center gap-4 xl:mt-4 xl:gap-6">
      <p class="font-number text-[2.75rem] leading-none font-semibold text-primary xl:text-[3.75rem]">
        <span class="sr-only">อันดับที่</span>#{{ standing.rank }}
      </p>
      <div>
        <p class="text-xs text-muted xl:text-sm">
          {{ isFinal ? 'ยอดซื้อเดือนนั้น' : 'ยอดซื้อเดือนนี้' }}
        </p>
        <p class="text-lg leading-tight font-semibold xl:text-2xl">
          {{ formatNumber(standing.totalSpentBaht) }} บาท
        </p>
      </div>
    </div>

    <template v-if="!isFinal">
      <p class="mt-4 text-xs text-muted xl:mt-5 xl:text-sm">
        {{ isInTargetRank ? `คุณติด Top ${standing.targetRank} แล้ว` : `อีก ${formatNumber(standing.amountToTargetBaht)} บาท ถึง Top ${standing.targetRank}` }}
      </p>
      <div
        class="mt-2 h-2 overflow-hidden rounded-full bg-border xl:h-2.5"
        role="progressbar"
        :aria-valuenow="progressPercent"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`ความคืบหน้าสู่ Top ${standing.targetRank}`"
      >
        <div class="h-full rounded-full bg-primary" :style="{ width: `${progressPercent}%` }" />
      </div>
      <button
        type="button"
        class="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:mt-5 xl:h-13 xl:text-base w-full"
        @click="emit('shop')"
      >
        ช้อปเพิ่มที่ร้าน YoYo
      </button>
    </template>
  </section>
</template>
