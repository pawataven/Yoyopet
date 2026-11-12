<script setup lang="ts">
import type { OrderSubmissionFailure, OrderSubmissionFailureReason } from '~/types/order'

// TODO: confirm the possible causes with the YoYo team
const possibleCauses = [
  'เลขนี้เคยใช้สะสมแต้มแล้ว',
  'คำสั่งซื้อถูกยกเลิกหรือคืนสินค้า',
  'ไม่ใช่คำสั่งซื้อจากร้าน YoYo'
]

const props = defineProps<{
  failure: OrderSubmissionFailure | null
}>()

const emit = defineEmits<{
  retry: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { supportChat } = useAppConfig()

const headingId = useId()
const retryButton = useTemplateRef<HTMLButtonElement>('retryButton')

const failureDescriptions: Record<OrderSubmissionFailureReason, (orderNumber: string) => string> = {
  already_submitted: orderNumber => `เลข #${orderNumber} ถูกใช้สะสมแต้มแล้ว`,
  invalid_order_number: orderNumber => `ไม่พบเลข #${orderNumber} ในระบบ`,
  unknown: () => 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
}

const failureDescription = computed(() =>
  props.failure ? failureDescriptions[props.failure.reason](props.failure.orderNumber) : ''
)
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-176"
    @opened="retryButton?.focus()"
  >
    <div v-if="failure" class="px-6 pt-8 pb-6 text-center sm:px-14 sm:pt-12 sm:pb-8">
      <span class="mx-auto flex size-18 items-center justify-center rounded-full bg-primary text-white sm:size-24" aria-hidden="true">
        <Icon name="lucide:circle-alert" class="size-9 sm:size-12" />
      </span>
      <h2 :id="headingId" class="mt-4 text-xl leading-tight sm:mt-5 sm:text-[2rem]">
        ส่งเลขคำสั่งซื้อไม่สำเร็จ
      </h2>
      <p class="mt-1 text-sm text-muted sm:text-base">
        {{ failureDescription }}
      </p>

      <div class="mt-5 rounded-2xl bg-primary-soft p-4 text-left sm:mt-7 sm:px-6 sm:py-5">
        <p class="text-sm font-semibold sm:text-base">
          สาเหตุที่อาจเป็นไปได้
        </p>
        <ul class="mt-2 space-y-1 text-xs text-muted sm:mt-3 sm:text-sm">
          <li v-for="cause in possibleCauses" :key="cause" class="before:mr-1.5 before:content-['•']">
            {{ cause }}
          </li>
        </ul>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-3 sm:mt-7 sm:gap-4">
        <button
          ref="retryButton"
          type="button"
          class="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark sm:h-14 sm:text-lg"
          @click="emit('retry')"
        >
          ลองใหม่อีกครั้ง
        </button>
        <a
          :href="supportChat.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:h-14 sm:text-lg"
        >
          ติดต่อเจ้าหน้าที่
        </a>
      </div>
    </div>
  </ModalDialog>
</template>
