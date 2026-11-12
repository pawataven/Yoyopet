<script setup lang="ts">
import type { OrderRejectionReason, SubmittedOrder, SubmittedOrderStatus } from '~/types/order'

defineProps<{
  submissions: SubmittedOrder[]
}>()

const { marketplaceStores } = useAppConfig()

const statusAppearance: Record<Exclude<SubmittedOrderStatus, 'rejected'>, { label: string, class: string }> = {
  'approved': { label: 'อนุมัติแล้ว', class: 'bg-success/10 text-success' },
  'in-return-window': { label: 'รอพ้นระยะคืนสินค้า', class: 'bg-gold/25 text-pending' },
  'verifying': { label: 'กำลังตรวจสอบ', class: 'bg-gold/25 text-pending' }
}

const rejectionReasonLabels: Record<OrderRejectionReason, string> = {
  duplicate: 'เลขซ้ำ',
  cancelled: 'ยกเลิกคำสั่งซื้อ'
}

function getStatusAppearance(order: SubmittedOrder) {
  if (order.status !== 'rejected') return statusAppearance[order.status]
  return {
    label: order.rejectionReason ? `ไม่ผ่าน: ${rejectionReasonLabels[order.rejectionReason]}` : 'ไม่ผ่าน',
    class: 'bg-primary-soft text-primary-dark'
  }
}

function getMarketplaceStore(order: SubmittedOrder) {
  return marketplaceStores.find(store => store.id === order.marketplaceId)
}

const headerCellClass = 'pt-4 pb-3 font-normal xl:pt-6 xl:pb-4'
</script>

<template>
  <section id="recent-order-submissions" aria-labelledby="recent-order-submissions-heading" class="mt-12 scroll-mt-24 xl:mt-17 xl:scroll-mt-32">
    <div class="flex items-center justify-between gap-4">
      <h2 id="recent-order-submissions-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
        รายการที่ส่งล่าสุด
      </h2>
      <NuxtLink to="/points/history" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <div v-if="submissions.length" class="mt-4 overflow-x-auto rounded-[1.25rem] border bg-white px-4 xl:mt-6 xl:px-8">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b text-xs text-muted xl:text-sm">
            <th scope="col" :class="headerCellClass">
              ช่องทาง
            </th>
            <th scope="col" :class="headerCellClass">
              เลขคำสั่งซื้อ
            </th>
            <th scope="col" class="hidden md:table-cell" :class="headerCellClass">
              วันที่ส่ง
            </th>
            <th scope="col" class="hidden text-right md:table-cell" :class="headerCellClass">
              ยอดซื้อ (บาท)
            </th>
            <th scope="col" class="text-right" :class="headerCellClass">
              แต้ม
            </th>
            <th scope="col" class="pl-6 xl:pl-15" :class="headerCellClass">
              สถานะ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in submissions" :key="order.id" class="border-b text-sm last:border-b-0 xl:text-base">
            <td class="py-3 pr-4">
              <span class="flex items-center gap-2.5 whitespace-nowrap xl:gap-3">
                <img
                  v-if="getMarketplaceStore(order)"
                  :src="getMarketplaceStore(order)!.logoUrl"
                  alt=""
                  width="32"
                  height="32"
                  loading="lazy"
                  class="size-7 shrink-0 rounded-lg xl:size-8"
                >
                <span class="sr-only sm:not-sr-only">{{ getMarketplaceStore(order)?.name }}</span>
              </span>
            </td>
            <td class="py-3 pr-4 font-semibold whitespace-nowrap">
              {{ order.orderNumber }}
            </td>
            <td class="hidden py-3 pr-4 whitespace-nowrap text-muted md:table-cell">
              {{ formatThaiShortDate(order.submittedAt) }}
            </td>
            <td class="hidden py-3 pr-4 text-right tabular-nums md:table-cell">
              <template v-if="order.spendBaht !== null">
                {{ formatNumber(order.spendBaht) }}
              </template>
              <span v-else class="text-muted" aria-label="ยังไม่มียอดซื้อ">–</span>
            </td>
            <td class="py-3 text-right">
              <span v-if="order.points" class="font-number text-base font-semibold text-success xl:text-lg">
                +{{ formatNumber(order.points) }}
              </span>
              <span v-else class="text-muted" aria-label="ไม่มีแต้ม">–</span>
            </td>
            <td class="py-3 pl-6 xl:pl-15">
              <span class="inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap xl:h-7 xl:text-sm" :class="getStatusAppearance(order).class">
                {{ getStatusAppearance(order).label }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mt-4 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted xl:mt-6 xl:text-lg">
      ยังไม่มีรายการที่ส่ง กรอกเลขคำสั่งซื้อแรกได้เลย
    </p>
  </section>
</template>
