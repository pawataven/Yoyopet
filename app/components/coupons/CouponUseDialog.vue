<script setup lang="ts">
import type { MemberCoupon } from '~/types/coupon'

const props = defineProps<{
  coupon: MemberCoupon
}>()

const emit = defineEmits<{
  showUsageGuide: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { copiedKey, copy } = useClipboardCopy()
const { marketplaceStores } = useAppConfig()

const isCodeCopied = computed(() => copiedKey.value === props.coupon.code)

const headline = computed(() => {
  const { discountType, discountValue } = props.coupon
  if (discountType === 'free_shipping') return 'ส่งฟรี'
  return discountType === 'percent' ? `${discountValue}%` : `${formatNumber(discountValue)} บาท`
})
const typeLabel = computed(() => (props.coupon.discountType === 'free_shipping' ? 'คูปองส่งฟรี' : 'คูปองส่วนลด'))

const conditions = computed(() => [
  props.coupon.minSpendBaht ? `ยอดซื้อขั้นต่ำ ${formatNumber(props.coupon.minSpendBaht)} บาท` : 'ไม่มียอดซื้อขั้นต่ำ',
  props.coupon.maxDiscountBaht ? `ลดสูงสุด ${formatNumber(props.coupon.maxDiscountBaht)} บาท` : null,
  'ใช้ได้ 1 ใบต่อ 1 คำสั่งซื้อ',
  `ใช้ได้ถึง ${formatThaiShortDate(props.coupon.expiresAt)} (อีก ${formatNumber(daysUntilEndOf(props.coupon.expiresAt))} วัน)`
].filter((condition): condition is string => Boolean(condition)))

const headingId = useId()
const copyButton = useTemplateRef('copyButton')
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-160 overflow-x-hidden"
    @opened="copyButton?.focus()"
  >
    <div class="relative bg-primary px-5 pt-6 pb-6 text-white sm:px-8 sm:pt-8 sm:pb-7">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-ink/45 text-white transition-colors hover:bg-ink/60 sm:top-5 sm:right-5 sm:size-9"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>
      <div class="flex items-center gap-3">
        <img src="/logo/logo.png" alt="" class="size-8 sm:size-9">
        <span class="text-sm text-white/90">{{ typeLabel }}</span>
      </div>
      <h2 :id="headingId" class="mt-2 font-sans text-[2rem] leading-tight font-semibold sm:mt-3 sm:text-[2.75rem]">
        {{ headline }}
      </h2>
      <span class="absolute -bottom-3.5 -left-3.5 size-7 rounded-full bg-ink/50 sm:-bottom-4 sm:-left-4 sm:size-8" aria-hidden="true" />
      <span class="absolute -right-3.5 -bottom-3.5 size-7 rounded-full bg-ink/50 sm:-right-4 sm:-bottom-4 sm:size-8" aria-hidden="true" />
    </div>

    <div class="px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
      <p class="text-xs text-muted sm:text-sm">
        โค้ดคูปอง
      </p>
      <div class="mt-2.5 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-cream py-2.5 pr-2.5 pl-5 sm:pr-3 sm:pl-6">
        <span class="truncate font-number text-xl font-semibold tracking-wide text-primary-dark sm:text-[1.625rem]">{{ coupon.code }}</span>
        <button
          ref="copyButton"
          type="button"
          class="flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:px-8 sm:text-[0.9375rem]"
          @click="copy(coupon.code)"
        >
          คัดลอกโค้ด
        </button>
      </div>
      <div class="mt-1.5 flex h-6 justify-end" aria-live="polite">
        <span v-if="isCodeCopied" class="flex items-center gap-1 rounded-full bg-success/10 px-3 text-xs font-semibold text-success">
          คัดลอกแล้ว
          <Icon name="lucide:check" class="size-3.5" />
        </span>
      </div>

      <h3 class="mt-4 font-sans text-base font-semibold sm:text-lg">
        เงื่อนไข
      </h3>
      <ul class="mt-2 space-y-1.5 text-sm sm:text-[0.9375rem]">
        <li v-for="condition in conditions" :key="condition" class="flex items-start gap-3">
          <Icon name="lucide:check" class="mt-0.5 size-4 shrink-0 text-success sm:size-4.5" />
          {{ condition }}
        </li>
      </ul>

      <h3 class="mt-6 font-sans text-base font-semibold sm:mt-9 sm:text-lg">
        ใช้ที่ร้าน YoYo บน
      </h3>
      <ul class="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        <li v-for="store in marketplaceStores" :key="store.id">
          <a
            :href="store.storeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-14 items-center gap-2 rounded-2xl border px-2.5 text-xs font-semibold transition-colors hover:border-primary/40 hover:bg-cream sm:h-16 sm:gap-2.5 sm:px-3 sm:text-[0.9375rem]"
          >
            <img :src="store.logoUrl" alt="" width="40" height="40" class="size-7 shrink-0 rounded-lg sm:size-9">
            <span class="min-w-0 leading-tight sm:whitespace-nowrap">{{ store.name }}</span>
          </a>
        </li>
      </ul>

      <p class="mt-7 text-center text-xs text-muted sm:mt-10 sm:text-sm">
        วางโค้ดในช่อง "โค้ดส่วนลดร้านค้า" ตอนชำระเงิน
      </p>
      <p class="mt-2.5 text-center">
        <button type="button" class="text-sm font-semibold text-primary-dark hover:underline" @click="emit('showUsageGuide')">
          ดูวิธีใช้คูปอง ›
        </button>
      </p>
    </div>
  </ModalDialog>
</template>
