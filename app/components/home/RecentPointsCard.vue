<script setup lang="ts">
import type { PointTransaction } from '~/types/points'

defineProps<{
  transactions: PointTransaction[]
}>()
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
      <li v-for="transaction in transactions" :key="transaction.id" class="border-b last:border-b-0">
        <PointTransactionRow :transaction="transaction" />
      </li>
    </ul>
    <p v-else class="my-auto py-10 text-center text-sm text-muted">
      ยังไม่มีประวัติแต้ม
    </p>
  </section>
</template>
