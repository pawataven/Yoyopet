<script setup lang="ts">
import type { OrderSubmissionResult } from '~/types/order'

const props = defineProps<{
  submission: OrderSubmissionResult | null
}>()

const emit = defineEmits<{
  viewStatus: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { marketplaceStores } = useAppConfig()

const headingId = useId()
const submitAnotherButton = useTemplateRef<HTMLButtonElement>('submitAnotherButton')

const marketplaceStore = computed(() => marketplaceStores.find(store => store.id === props.submission?.marketplaceId))

const detailRowClass = 'flex items-center justify-between gap-4 text-sm sm:text-base'
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-164"
    @opened="submitAnotherButton?.focus()"
  >
    <div v-if="submission" class="px-6 pt-8 pb-6 text-center sm:px-12 sm:pt-12 sm:pb-8">
      <SuccessCheckmark />
      <h2 :id="headingId" class="mt-4 text-xl leading-tight sm:mt-5 sm:text-[2rem]">
        ส่งเลขคำสั่งซื้อแล้ว
      </h2>
      <p class="mt-1 text-sm text-muted sm:text-base">
        ระบบจะตรวจสอบภายใน 24 ชม.
      </p>

      <div class="mt-5 rounded-2xl bg-cream p-4 text-left sm:mt-7 sm:p-6">
        <div class="flex items-center gap-3 sm:gap-4">
          <img
            v-if="marketplaceStore"
            :src="marketplaceStore.logoUrl"
            alt=""
            width="48"
            height="48"
            class="size-10 shrink-0 rounded-lg sm:size-12"
          >
          <div class="min-w-0">
            <p class="text-sm font-semibold sm:text-base">
              {{ marketplaceStore?.name }}
            </p>
            <p class="truncate text-xs text-muted sm:text-sm">
              <span class="sr-only">เลขคำสั่งซื้อ </span>#{{ submission.orderNumber }}
            </p>
          </div>
        </div>

        <dl v-if="submission.estimatedPoints !== null || submission.expectedCreditDate" class="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
          <div v-if="submission.estimatedPoints !== null" :class="detailRowClass">
            <dt class="text-muted">
              แต้มที่คาดว่าจะได้
            </dt>
            <dd class="font-semibold text-success">
              +<span class="font-number">{{ formatNumber(submission.estimatedPoints) }}</span> แต้ม
            </dd>
          </div>
          <div v-if="submission.expectedCreditDate" :class="detailRowClass">
            <dt class="text-muted">
              ใช้ได้ประมาณ
            </dt>
            <dd class="font-semibold">
              {{ formatThaiShortDate(submission.expectedCreditDate) }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="mt-5 grid gap-3 sm:mt-7 sm:gap-4">
        <button
          ref="submitAnotherButton"
          type="button"
          class="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark sm:h-14 sm:text-lg"
          @click="isOpen = false"
        >
          กรอกเลขคำสั่งซื้ออื่น
        </button>
        <button
          type="button"
          class="flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:h-14 sm:text-lg"
          @click="emit('viewStatus')"
        >
          ดูสถานะ
        </button>
      </div>
      <p class="mt-4 text-xs text-muted sm:mt-5 sm:text-sm">
        เราจะแจ้งผลผ่าน LINE
      </p>
    </div>
  </ModalDialog>
</template>
