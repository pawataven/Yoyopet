<script setup lang="ts">
import type { PendingOrdersSummary } from '~/types/member'

defineProps<{
  pendingOrders: PendingOrdersSummary
}>()
</script>

<template>
  <div class="flex min-h-14 items-center gap-3 rounded-2xl bg-gold/20 px-4 py-3 text-sm xl:min-h-16 xl:px-6 xl:text-lg">
    <Icon name="lucide:clock" class="size-5 shrink-0 text-pending" />
    <p class="min-w-0 flex-1">
      รอยืนยัน {{ formatNumber(pendingOrders.count) }} รายการ ·
      <strong class="font-semibold">+{{ formatNumber(pendingOrders.points) }} แต้ม</strong>
    </p>
    <NuxtLink to="/orders?status=pending" class="shrink-0 font-semibold text-pending hover:underline">
      ดูสถานะ ›
    </NuxtLink>
  </div>
</template>
