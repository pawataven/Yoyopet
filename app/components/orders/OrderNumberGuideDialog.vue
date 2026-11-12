<script setup lang="ts">
import type { MarketplaceId } from '~/types/order'

const isOpen = defineModel<boolean>('open', { required: true })
const selectedMarketplaceId = defineModel<MarketplaceId>('marketplaceId', { required: true })

const headingId = useId()
const confirmButton = useTemplateRef<HTMLButtonElement>('confirmButton')
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-217"
    @opened="confirmButton?.focus()"
  >
    <div class="relative px-5 pt-6 pb-6 sm:px-10 sm:pt-10 sm:pb-8">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border text-ink transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:top-6 sm:right-6 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-4.5 sm:size-5" />
      </button>

      <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.75rem]">
        หาเลขคำสั่งซื้อได้ที่ไหน
      </h2>

      <OrderNumberGuideContent v-model:marketplace-id="selectedMarketplaceId" size="large" class="mt-4 sm:mt-5" />

      <button
        ref="confirmButton"
        type="button"
        class="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark sm:mt-6 sm:h-14.5 sm:text-lg"
        @click="isOpen = false"
      >
        เข้าใจแล้ว
      </button>
    </div>
  </ModalDialog>
</template>
