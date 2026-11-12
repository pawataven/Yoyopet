<script setup lang="ts">
import type { SubmittedOrder } from '~/types/order'

defineProps<{
  submissions: SubmittedOrder[]
}>()

const emit = defineEmits<{
  select: [orderId: string]
}>()

const { marketplaceStores } = useAppConfig()

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
          <tr
            v-for="order in submissions"
            :key="order.id"
            class="cursor-pointer border-b text-sm transition-colors last:border-b-0 hover:bg-cream xl:text-base"
            @click="emit('select', order.id)"
          >
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
              <button
                type="button"
                :aria-label="`ดูรายละเอียดคำสั่งซื้อ ${order.orderNumber}`"
                class="rounded hover:text-primary-dark hover:underline focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none"
                @click.stop="emit('select', order.id)"
              >
                {{ order.orderNumber }}
              </button>
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
              <span class="inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap xl:h-7 xl:text-sm" :class="getSubmittedOrderStatusBadge(order).class">
                {{ getSubmittedOrderStatusBadge(order).label }}
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
