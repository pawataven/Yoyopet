<script setup lang="ts">
import type { SubmittedOrder } from '~/types/order'

defineProps<{
  orders: SubmittedOrder[]
  showRowChevron?: boolean
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
  <div class="relative overflow-x-auto rounded-[1.25rem] border bg-white px-4 xl:px-8">
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
          <th v-if="showRowChevron" scope="col" :class="headerCellClass">
            <span class="sr-only">ดูรายละเอียด</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
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
          <td v-if="showRowChevron" class="py-3 pl-4 text-right">
            <Icon name="lucide:chevron-right" class="size-4 text-ink xl:size-5" aria-hidden="true" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
