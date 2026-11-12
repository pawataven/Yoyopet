<script setup lang="ts">
import type { OrderSubmissionResult } from '~/types/order'

const props = defineProps<{
  submission: OrderSubmissionResult | null
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { marketplaceStores } = useAppConfig()

const headingId = useId()
const submitAnotherButton = useTemplateRef<HTMLButtonElement>('submitAnotherButton')

const marketplaceStore = computed(() => marketplaceStores.find(store => store.id === props.submission?.marketplaceId))
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-140"
    @opened="submitAnotherButton?.focus()"
  >
    <div v-if="submission" class="px-6 pt-8 pb-6 text-center sm:px-10 sm:pt-10 sm:pb-10">
      <SuccessCheckmark />
      <h2 :id="headingId" class="mt-5 text-xl leading-tight sm:mt-6 sm:text-[1.75rem]">
        ส่งเลขคำสั่งซื้อแล้ว
      </h2>
      <p class="mt-1.5 text-sm text-muted sm:mt-2 sm:text-base">
        ระบบจะตรวจสอบภายใน 24 ชม. แต้มจะใช้ได้เมื่อพ้นระยะคืนสินค้า
      </p>

      <div class="mt-5 flex items-center gap-3 rounded-2xl bg-cream px-4 py-3.5 text-left sm:mt-6 sm:gap-4 sm:px-5 sm:py-4">
        <img
          v-if="marketplaceStore"
          :src="marketplaceStore.logoUrl"
          alt=""
          width="42"
          height="42"
          class="size-9 shrink-0 rounded-lg sm:size-10.5"
        >
        <div class="min-w-0">
          <p class="text-xs text-muted sm:text-sm">
            {{ marketplaceStore?.name }} · เลขคำสั่งซื้อ
          </p>
          <p class="truncate font-number text-base font-semibold sm:text-lg">
            {{ submission.orderNumber }}
          </p>
        </div>
        <span class="ml-auto shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-pending sm:text-sm">
          กำลังตรวจสอบ
        </span>
      </div>

      <div class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
        <NuxtLink
          to="/"
          class="flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft"
        >
          กลับหน้าแรก
        </NuxtLink>
        <button
          ref="submitAnotherButton"
          type="button"
          class="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark"
          @click="isOpen = false"
        >
          กรอกเลขอื่นต่อ
        </button>
      </div>
    </div>
  </ModalDialog>
</template>
