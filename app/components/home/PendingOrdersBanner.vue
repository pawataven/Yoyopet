<script setup lang="ts">
import type { PendingOrdersSummary } from '~/types/member'

defineProps<{
  pendingOrders: PendingOrdersSummary
}>()

const isStatusDialogOpen = ref(false)
</script>

<template>
  <div class="flex min-h-12 items-center gap-3 rounded-2xl bg-gold/20 px-4 py-3 text-sm max-md:text-pending md:min-h-14 xl:min-h-16 xl:px-6 xl:text-lg">
    <Icon name="lucide:clock" class="size-5 shrink-0 text-pending" />
    <p class="min-w-0 flex-1">
      <span class="max-md:font-semibold">รอยืนยัน {{ formatNumber(pendingOrders.count) }} รายการ</span> ·
      <strong class="font-semibold max-md:font-normal">+{{ formatNumber(pendingOrders.points) }} แต้ม</strong>
    </p>
    <button
      type="button"
      aria-haspopup="dialog"
      class="flex shrink-0 items-center font-semibold text-pending hover:underline"
      @click="isStatusDialogOpen = true"
    >
      ดูสถานะ<span class="max-md:hidden">&nbsp;›</span>
      <Icon name="lucide:chevron-right" class="size-4 md:hidden" />
    </button>

    <PendingOrdersDialog v-model:open="isStatusDialogOpen" />
  </div>
</template>
