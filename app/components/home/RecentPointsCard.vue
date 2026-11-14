<script setup lang="ts">
import type { PointTransaction } from '~/types/points'

defineProps<{
  transactions: PointTransaction[]
}>()

const MOBILE_VISIBLE_TRANSACTIONS = 3
</script>

<template>
  <section aria-labelledby="recent-points-heading" class="flex flex-col md:rounded-[1.25rem] md:border md:bg-white md:px-6 md:pt-6 md:pb-3 xl:px-8 xl:pt-8 xl:pb-5">
    <div class="flex items-center justify-between gap-4">
      <h2 id="recent-points-heading" class="text-2xl leading-tight md:text-lg xl:text-2xl">
        <span class="max-md:hidden">ประวัติ</span>แต้มล่าสุด
      </h2>
      <NuxtLink to="/points/history" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <ul v-if="transactions.length" class="mt-3 max-md:rounded-[1.25rem] max-md:border max-md:bg-white max-md:px-3.5 max-md:py-1 xl:mt-4">
      <li
        v-for="(transaction, index) in transactions"
        :key="transaction.id"
        class="border-b last:border-b-0"
        :class="[index >= MOBILE_VISIBLE_TRANSACTIONS - 1 && 'max-md:border-b-0', index >= MOBILE_VISIBLE_TRANSACTIONS && 'max-md:hidden']"
      >
        <PointTransactionRow :transaction="transaction" />
      </li>
    </ul>
    <p v-else class="my-auto py-10 text-center text-sm text-muted max-md:mt-3 max-md:rounded-[1.25rem] max-md:border">
      ยังไม่มีประวัติแต้ม
    </p>
  </section>
</template>
