<script setup lang="ts">
import type { MarketplaceId, OrderSubmissionFailure, OrderSubmissionResult } from '~/types/order'

const MAX_PROOF_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_PROOF_IMAGE_TYPES = ['image/jpeg', 'image/png']

const emit = defineEmits<{
  submitted: [result: OrderSubmissionResult]
  failed: [failure: OrderSubmissionFailure]
  showExample: []
}>()

const selectedMarketplaceId = defineModel<MarketplaceId>('marketplaceId', { required: true })

const { marketplaceStores } = useAppConfig()
const { submitOrder, isSubmitting } = useOrderSubmission()

const fieldId = useId()
const orderNumberInput = useTemplateRef<HTMLInputElement>('orderNumberInput')
const proofImageInput = useTemplateRef<HTMLInputElement>('proofImageInput')

const orderNumber = ref('')
const proofImage = ref<File | null>(null)
const proofImagePreviewUrl = ref<string | null>(null)
const isDraggingProofImage = ref(false)
const hasConfirmedOwnership = ref(false)

const orderNumberError = ref('')
const proofImageError = ref('')
const ownershipError = ref('')

const selectedGuide = computed(() => orderNumberGuides[selectedMarketplaceId.value])

watch(orderNumber, () => {
  orderNumberError.value = ''
})
watch(hasConfirmedOwnership, () => {
  ownershipError.value = ''
})

function clearProofImage() {
  if (proofImagePreviewUrl.value) URL.revokeObjectURL(proofImagePreviewUrl.value)
  proofImage.value = null
  proofImagePreviewUrl.value = null
  proofImageError.value = ''
  if (proofImageInput.value) proofImageInput.value.value = ''
}

function selectProofImage(file: File | undefined) {
  if (!file) return
  if (!ACCEPTED_PROOF_IMAGE_TYPES.includes(file.type)) {
    proofImageError.value = 'รองรับเฉพาะไฟล์ JPG หรือ PNG'
    return
  }
  if (file.size > MAX_PROOF_IMAGE_BYTES) {
    proofImageError.value = 'ไฟล์ใหญ่เกิน 5MB'
    return
  }
  clearProofImage()
  proofImage.value = file
  proofImagePreviewUrl.value = URL.createObjectURL(file)
}

function handleProofImageDrop(event: DragEvent) {
  isDraggingProofImage.value = false
  selectProofImage(event.dataTransfer?.files[0])
}

onBeforeUnmount(clearProofImage)

function validate() {
  orderNumberError.value = orderNumber.value.trim() ? '' : 'กรุณากรอกเลขคำสั่งซื้อ'
  ownershipError.value = hasConfirmedOwnership.value ? '' : 'กรุณายืนยันว่าเป็นคำสั่งซื้อของคุณเอง'
  return !orderNumberError.value && !ownershipError.value
}

async function handleSubmit() {
  if (!validate()) {
    if (orderNumberError.value) orderNumberInput.value?.focus()
    return
  }
  const outcome = await submitOrder(
    { marketplaceId: selectedMarketplaceId.value, orderNumber: orderNumber.value },
    proofImage.value
  )
  if (!outcome) return
  if ('failure' in outcome) {
    emit('failed', outcome.failure)
    return
  }
  orderNumber.value = ''
  hasConfirmedOwnership.value = false
  clearProofImage()
  emit('submitted', outcome.result)
}

function focusOrderNumber() {
  orderNumberInput.value?.focus()
  orderNumberInput.value?.select()
}

defineExpose({ focusOrderNumber })

const stepNumberClass = 'flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-number text-sm font-semibold text-white xl:size-8 xl:text-base'
const stepTitleClass = 'flex items-center gap-2.5 font-heading text-lg font-medium xl:gap-3 xl:text-2xl'
</script>

<template>
  <form
    novalidate
    aria-label="กรอกเลขคำสั่งซื้อ"
    class="rounded-3xl border bg-white p-5 xl:p-8"
    @submit.prevent="handleSubmit"
  >
    <fieldset>
      <legend :class="stepTitleClass">
        <span :class="stepNumberClass" aria-hidden="true">1</span>
        เลือกช่องทางที่ซื้อ
      </legend>
      <div class="mt-3 grid gap-2.5 sm:grid-cols-3 xl:mt-4 xl:gap-3">
        <label
          v-for="store in marketplaceStores"
          :key="store.id"
          class="relative flex h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white px-3 transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-24 xl:gap-4 xl:px-5"
        >
          <input
            v-model="selectedMarketplaceId"
            type="radio"
            :name="`${fieldId}-marketplace`"
            :value="store.id"
            class="peer sr-only"
          >
          <img :src="store.logoUrl" alt="" width="56" height="56" class="size-10 shrink-0 rounded-xl xl:size-14">
          <span class="min-w-0 flex-1 truncate font-heading text-base font-medium xl:text-[1.375rem]">{{ store.name }}</span>
          <span
            aria-hidden="true"
            class="flex size-5 shrink-0 items-center justify-center self-center rounded-full border-2 border-muted/30 bg-white text-white peer-checked:border-primary peer-checked:bg-primary sm:absolute sm:top-2.5 sm:right-2.5 xl:top-3.5 xl:right-3.5 xl:size-7"
          >
            <Icon name="lucide:check" class="size-3 xl:size-4.5" />
          </span>
        </label>
      </div>
    </fieldset>

    <div class="mt-6 xl:mt-9">
      <label :for="`${fieldId}-order-number`" :class="stepTitleClass">
        <span :class="stepNumberClass" aria-hidden="true">2</span>
        กรอกเลขคำสั่งซื้อ
      </label>
      <input
        :id="`${fieldId}-order-number`"
        ref="orderNumberInput"
        v-model="orderNumber"
        type="text"
        required
        maxlength="40"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        :placeholder="selectedGuide.orderNumberPlaceholder"
        :aria-invalid="orderNumberError ? 'true' : undefined"
        :aria-describedby="`${fieldId}-order-number-hint${orderNumberError ? ` ${fieldId}-order-number-error` : ''}`"
        class="mt-3 h-12 w-full rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none xl:mt-4 xl:h-16 xl:px-6 xl:text-lg"
        :class="orderNumberError ? 'border-primary' : 'border-muted/25'"
      >
      <p v-if="orderNumberError" :id="`${fieldId}-order-number-error`" class="mt-1.5 text-sm text-primary-dark xl:text-base">
        {{ orderNumberError }}
      </p>
      <div class="mt-2 flex items-start justify-between gap-3 text-xs xl:mt-3 xl:text-[0.9375rem]">
        <p :id="`${fieldId}-order-number-hint`" class="flex min-w-0 items-start gap-1.5 text-muted">
          <Icon name="lucide:info" class="mt-px size-3.5 shrink-0 xl:size-4.5" />
          <span>{{ marketplaceStores.find(store => store.id === selectedMarketplaceId)?.name }}: {{ selectedGuide.orderNumberPath }}</span>
        </p>
        <button
          type="button"
          class="shrink-0 font-semibold text-primary-dark hover:underline"
          @click="emit('showExample')"
        >
          ดูตัวอย่าง ›
        </button>
      </div>
    </div>

    <div class="mt-6 xl:mt-9">
      <p :id="`${fieldId}-proof-heading`" :class="stepTitleClass">
        <span :class="stepNumberClass" aria-hidden="true">3</span>
        แนบหลักฐาน (ไม่บังคับ)
      </p>

      <div
        v-if="proofImage && proofImagePreviewUrl"
        class="mt-3 flex items-center gap-4 rounded-2xl border-2 border-primary/30 bg-cream p-3 xl:mt-4 xl:gap-5 xl:p-4"
      >
        <img :src="proofImagePreviewUrl" alt="ตัวอย่างรูปหลักฐาน" class="size-16 shrink-0 rounded-xl object-cover xl:size-24">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold xl:text-lg">
            {{ proofImage.name }}
          </p>
          <p class="text-xs text-muted xl:text-[0.9375rem]">
            {{ formatNumber(Math.ceil(proofImage.size / 1024)) }} KB
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:text-base"
          @click="clearProofImage"
        >
          ลบรูป
        </button>
      </div>

      <label
        v-else
        class="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:mt-4 xl:min-h-38 xl:py-8"
        :class="isDraggingProofImage ? 'border-primary bg-primary-soft' : 'border-primary/30 bg-cream hover:border-primary/60'"
        @dragover.prevent="isDraggingProofImage = true"
        @dragleave="isDraggingProofImage = false"
        @drop.prevent="handleProofImageDrop"
      >
        <input
          ref="proofImageInput"
          type="file"
          :accept="ACCEPTED_PROOF_IMAGE_TYPES.join(',')"
          :aria-labelledby="`${fieldId}-proof-heading`"
          :aria-describedby="`${fieldId}-proof-hint`"
          class="sr-only"
          @change="selectProofImage(($event.target as HTMLInputElement).files?.[0])"
        >
        <Icon name="lucide:upload" class="size-7 text-primary xl:size-10" />
        <span class="mt-2 text-sm xl:mt-3 xl:text-lg">ลากรูปมาวาง หรือกดเพื่อเลือกรูปหน้าจอคำสั่งซื้อ</span>
        <span :id="`${fieldId}-proof-hint`" class="mt-0.5 text-xs text-muted xl:text-[0.9375rem]">รองรับ JPG, PNG ไม่เกิน 5MB</span>
      </label>
      <p v-if="proofImageError" role="alert" class="mt-1.5 text-sm text-primary-dark xl:text-base">
        {{ proofImageError }}
      </p>
    </div>

    <div class="mt-5 xl:mt-7">
      <label class="flex cursor-pointer items-start gap-2.5 text-sm xl:gap-3 xl:text-lg">
        <input
          v-model="hasConfirmedOwnership"
          type="checkbox"
          :aria-invalid="ownershipError ? 'true' : undefined"
          :aria-describedby="ownershipError ? `${fieldId}-ownership-error` : undefined"
          class="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-primary xl:mt-1 xl:size-5.5"
        >
        <span>
          ยืนยันว่าเป็นคำสั่งซื้อของฉันเอง และยอมรับ
          <NuxtLink to="/help/how-to-earn" class="font-semibold text-primary-dark underline-offset-2 hover:underline">เงื่อนไขการสะสมแต้ม</NuxtLink>
        </span>
      </label>
      <p v-if="ownershipError" :id="`${fieldId}-ownership-error`" class="mt-1.5 text-sm text-primary-dark xl:text-base">
        {{ ownershipError }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 xl:mt-6 xl:h-14 xl:text-lg"
    >
      <Icon v-if="isSubmitting" name="lucide:loader-circle" class="size-5 animate-spin" />
      ส่งเลขคำสั่งซื้อ
    </button>
    <p class="mt-3 text-center text-xs text-muted xl:mt-4 xl:text-[0.9375rem]">
      ระบบตรวจสอบภายใน 24 ชม. แต้มจะใช้ได้เมื่อพ้นระยะคืนสินค้า
    </p>
  </form>
</template>
