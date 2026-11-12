<script setup lang="ts">
import type { PendingOrder } from '~/types/order'

const isOpen = defineModel<boolean>('open', { required: true })

const { pendingOrders } = usePendingOrders()
const { marketplaceStores } = useAppConfig()

const headingId = useId()
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

function marketplaceStore(order: PendingOrder) {
  return marketplaceStores.find(store => store.id === order.marketplaceId)
}

function orderStatusLabel(order: PendingOrder) {
  if (order.status === 'verifying') return 'กำลังตรวจสอบเลขคำสั่งซื้อ'
  return order.expectedCreditDate ? `คาดว่าใช้ได้ ${formatThaiShortDate(order.expectedCreditDate)}` : 'รอพ้นระยะคืนสินค้า'
}
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-203"
    @opened="closeButton?.focus()"
  >
    <template #close>
      <button
        ref="closeButton"
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border text-ink transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:top-6 sm:right-6 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-4.5 sm:size-5" />
      </button>
    </template>
    <div class="relative px-5 pt-6 pb-6 sm:px-10 sm:pt-10 sm:pb-10">
      <h2 :id="headingId" class="pr-12 font-sans text-xl leading-tight font-semibold sm:text-[1.75rem]">
        รายการรอยืนยัน {{ formatNumber(pendingOrders.length) }} รายการ
      </h2>
      <p class="mt-1.5 text-sm text-muted sm:mt-2 sm:text-base">
        แต้มจะใช้ได้เมื่อคำสั่งซื้อสำเร็จและพ้นระยะคืนสินค้า
      </p>

      <ul class="mt-5 space-y-4 sm:mt-6">
        <li
          v-for="order in pendingOrders"
          :key="order.id"
          class="rounded-[1.25rem] bg-cream px-4 pt-5 pb-7 sm:px-6 sm:pt-6 sm:pb-8"
        >
          <div class="flex items-start gap-3 sm:gap-4">
            <img
              v-if="marketplaceStore(order)"
              :src="marketplaceStore(order)!.logoUrl"
              alt=""
              width="42"
              height="42"
              class="size-9 shrink-0 rounded-lg sm:size-10.5"
            >
            <div class="min-w-0 flex-1">
              <h3 class="truncate font-sans text-base font-semibold sm:text-lg">
                {{ marketplaceStore(order)?.name }} #{{ order.orderNumber }}
              </h3>
              <p class="text-xs text-pending sm:text-sm">
                {{ orderStatusLabel(order) }}
              </p>
            </div>
            <p class="shrink-0 text-base font-semibold text-success sm:text-xl">
              +{{ formatNumber(order.points) }} แต้ม
            </p>
          </div>

          <PendingOrderProgress :status="order.status" class="mt-8 mb-7 sm:mt-11" />
        </li>
      </ul>

      <NuxtLink
        to="/orders/submit"
        class="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark sm:mt-8 sm:h-13.5 sm:text-lg"
        @click="isOpen = false"
      >
        กรอกเลขคำสั่งซื้อเพิ่ม
      </NuxtLink>
    </div>
  </ModalDialog>
</template>
