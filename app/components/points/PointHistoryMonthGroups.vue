<script setup lang="ts">
import type { PointTransaction } from '~/types/points'

const props = defineProps<{
  transactions: PointTransaction[]
}>()

const monthGroups = computed(() => {
  const groupsByMonth = new Map<string, PointTransaction[]>()
  for (const transaction of props.transactions) {
    const monthKey = transaction.occurredAt.slice(0, 7)
    const group = groupsByMonth.get(monthKey)
    if (group) group.push(transaction)
    else groupsByMonth.set(monthKey, [transaction])
  }
  return [...groupsByMonth].map(([monthKey, transactions]) => ({
    monthKey,
    label: formatThaiMonthYear(`${monthKey}-01`),
    transactions
  }))
})
</script>

<template>
  <div class="space-y-8 xl:space-y-10">
    <section v-for="group in monthGroups" :key="group.monthKey" :aria-labelledby="`point-month-${group.monthKey}`">
      <h2 :id="`point-month-${group.monthKey}`" class="font-sans text-base font-semibold xl:text-[1.375rem]">
        {{ group.label }}
      </h2>
      <ul class="mt-3 rounded-[1.25rem] border bg-white px-4 py-1 xl:mt-4 xl:px-7 xl:py-1.5">
        <li v-for="transaction in group.transactions" :key="transaction.id" class="border-b last:border-b-0">
          <PointTransactionRow :transaction="transaction" hide-year />
        </li>
      </ul>
    </section>
  </div>
</template>
