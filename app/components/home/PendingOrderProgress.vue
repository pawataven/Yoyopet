<script setup lang="ts">
import type { PendingOrderStatus } from '~/types/order'

const props = defineProps<{
  status: PendingOrderStatus
}>()

const progressSteps = ['ส่งเลขแล้ว', 'ตรวจสอบแล้ว', 'พ้นระยะคืนสินค้า', 'แต้มเข้า']

const inProgressStepIndexByStatus: Record<PendingOrderStatus, number> = {
  'verifying': 1,
  'in-return-window': 2
}

const inProgressStepIndex = computed(() => inProgressStepIndexByStatus[props.status])
const lastStepIndex = progressSteps.length - 1

function stepPositionPercent(index: number) {
  return (index / lastStepIndex) * 100
}
</script>

<template>
  <ol class="relative mr-10 ml-5 h-6.5 max-w-[29.5rem] sm:ml-5.5" aria-label="สถานะคำสั่งซื้อ">
    <span class="absolute inset-x-0 top-1/2 h-0.75 -translate-y-1/2 rounded-full bg-border" aria-hidden="true" />
    <span
      class="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full bg-success"
      :style="{ width: `${stepPositionPercent(inProgressStepIndex)}%` }"
      aria-hidden="true"
    />
    <li
      v-for="(step, index) in progressSteps"
      :key="step"
      class="absolute top-0 flex -translate-x-1/2 flex-col items-center"
      :style="{ left: `${stepPositionPercent(index)}%` }"
      :aria-current="index === inProgressStepIndex ? 'step' : undefined"
    >
      <span
        class="flex size-6.5 items-center justify-center rounded-full"
        :class="[
          index < inProgressStepIndex && 'bg-success text-white',
          index === inProgressStepIndex && 'border-2 border-pending bg-white',
          index > inProgressStepIndex && 'border-2 border-border bg-white'
        ]"
      >
        <Icon v-if="index < inProgressStepIndex" name="lucide:check" class="size-3.5" />
      </span>
      <span
        class="mt-2.5 text-[0.6875rem] whitespace-nowrap sm:text-sm"
        :class="[
          index < inProgressStepIndex && 'text-ink',
          index === inProgressStepIndex && 'font-semibold text-ink',
          index > inProgressStepIndex && 'text-muted'
        ]"
      >
        <span v-if="index < inProgressStepIndex" class="sr-only">เสร็จแล้ว: </span>{{ step }}
      </span>
    </li>
  </ol>
</template>
