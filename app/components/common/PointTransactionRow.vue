<script setup lang="ts">
import type { PointTransaction } from '~/types/points'

const props = defineProps<{
  transaction: PointTransaction
  hideYear?: boolean
}>()

const appearance = computed(() => getPointTransactionAppearance(props.transaction))
const dateLabel = computed(() =>
  props.hideYear ? formatThaiDayMonth(props.transaction.occurredAt) : formatThaiShortDate(props.transaction.occurredAt)
)
</script>

<template>
  <div class="flex min-h-16 items-center gap-3 py-2 xl:min-h-19 xl:gap-4">
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-full xl:size-12"
      :class="appearance.iconClass"
    >
      <Icon v-if="appearance.icon" :name="appearance.icon" class="size-5" />
      <OrderEntryIcon v-else class="size-5" />
    </span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm xl:text-lg">
        {{ transaction.title }}
      </p>
      <p class="truncate text-xs text-muted xl:mt-0.5 xl:text-[0.9375rem]">
        <template v-if="transaction.reference">
          #{{ transaction.reference }} ·
        </template>
        {{ dateLabel }}
      </p>
    </div>
    <span class="shrink-0 font-number text-lg font-semibold xl:text-[1.375rem]" :class="appearance.amountClass">
      {{ formatSignedPoints(transaction.points) }}
    </span>
  </div>
</template>
