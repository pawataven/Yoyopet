<script setup lang="ts">
import type { SubmittedOrder } from '~/types/order'

defineProps<{
  submissions: SubmittedOrder[]
}>()

const emit = defineEmits<{
  select: [orderId: string]
}>()
</script>

<template>
  <section id="recent-order-submissions" aria-labelledby="recent-order-submissions-heading" class="mt-12 scroll-mt-24 xl:mt-17 xl:scroll-mt-32">
    <div class="flex items-center justify-between gap-4">
      <h2 id="recent-order-submissions-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
        รายการที่ส่งล่าสุด
      </h2>
      <NuxtLink to="/orders/history" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <SubmittedOrdersTable
      v-if="submissions.length"
      :orders="submissions"
      class="mt-4 xl:mt-6"
      @select="orderId => emit('select', orderId)"
    />
    <p v-else class="mt-4 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted xl:mt-6 xl:text-lg">
      ยังไม่มีรายการที่ส่ง กรอกเลขคำสั่งซื้อแรกได้เลย
    </p>
  </section>
</template>
