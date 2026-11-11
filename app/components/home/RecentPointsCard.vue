<script setup lang="ts">
import type { PointTransaction } from '~/types/points'

defineProps<{
  transactions: PointTransaction[]
}>()

type TransactionAppearance = { icon: string | null, iconClass: string, amountClass: string }

function getAppearance(transaction: PointTransaction): TransactionAppearance {
  if (transaction.status === 'pending') {
    return { icon: 'lucide:clock', iconClass: 'bg-gold/25 text-pending', amountClass: 'text-pending' }
  }
  if (transaction.kind === 'redemption') {
    return { icon: 'lucide:ticket', iconClass: 'bg-primary-soft text-primary-dark', amountClass: 'text-primary-dark' }
  }
  if (transaction.kind === 'referral') {
    return { icon: 'lucide:users', iconClass: 'bg-success/10 text-success', amountClass: 'text-success' }
  }
  return { icon: null, iconClass: 'bg-success/10 text-success', amountClass: 'text-success' }
}

function formatSignedPoints(points: number) {
  return points < 0 ? `−${formatNumber(Math.abs(points))}` : `+${formatNumber(points)}`
}
</script>

<template>
  <section aria-labelledby="recent-points-heading" class="flex flex-col rounded-[1.25rem] border bg-white px-6 pt-6 pb-3 xl:px-8 xl:pt-8 xl:pb-5">
    <div class="flex items-center justify-between gap-4">
      <h2 id="recent-points-heading" class="text-lg leading-tight xl:text-2xl">
        ประวัติแต้มล่าสุด
      </h2>
      <NuxtLink to="/points/history" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <ul v-if="transactions.length" class="mt-3 xl:mt-4">
      <li
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex min-h-16 items-center gap-3 border-b py-2 last:border-b-0 xl:min-h-19 xl:gap-4"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full xl:size-12"
          :class="getAppearance(transaction).iconClass"
        >
          <Icon v-if="getAppearance(transaction).icon" :name="getAppearance(transaction).icon!" class="size-5" />
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
            {{ formatThaiShortDate(transaction.occurredAt) }}
          </p>
        </div>
        <span class="shrink-0 font-number text-lg font-semibold xl:text-[1.375rem]" :class="getAppearance(transaction).amountClass">
          {{ formatSignedPoints(transaction.points) }}
        </span>
      </li>
    </ul>
    <p v-else class="my-auto py-10 text-center text-sm text-muted">
      ยังไม่มีประวัติแต้ม
    </p>
  </section>
</template>
