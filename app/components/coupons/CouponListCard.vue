<script setup lang="ts">
import type { MemberCoupon } from '~/types/coupon'

const props = defineProps<{
  coupon: MemberCoupon
}>()

const emit = defineEmits<{
  apply: [coupon: MemberCoupon]
}>()

const { copiedKey, copy } = useClipboardCopy()

const isActive = computed(() => props.coupon.status === 'active')
const isCodeCopied = computed(() => copiedKey.value === props.coupon.code)
const daysLeft = computed(() => daysUntilEndOf(props.coupon.expiresAt))
const isExpiringSoon = computed(() => isCouponExpiringSoon(props.coupon))

const statusBadge = computed(() => {
  if (props.coupon.status === 'used') return { label: 'ใช้แล้ว', class: 'bg-border text-muted' }
  if (props.coupon.status === 'expired') return { label: 'หมดอายุ', class: 'bg-border text-muted' }
  if (isExpiringSoon.value) return { label: 'ใกล้หมดอายุ', class: 'bg-gold/30 text-pending' }
  if (props.coupon.tierName) return { label: 'สิทธิ์ระดับ', class: 'bg-primary-soft text-primary-dark' }
  return null
})

const description = computed(() => {
  const { status, redemption } = props.coupon
  if (status === 'used' && redemption) return `ใช้กับ ${redemption.marketplaceName} #${redemption.orderNumber}`
  if (status === 'expired') return 'ไม่ได้ใช้ภายในเวลาที่กำหนด'
  return formatCouponConditions(props.coupon)
})

const footnote = computed(() => {
  const { status, redemption, expiresAt } = props.coupon
  if (status === 'used') return `ใช้แล้ว ${formatThaiShortDate(redemption?.usedAt ?? expiresAt)}`
  if (status === 'expired') return `หมดอายุ ${formatThaiShortDate(expiresAt)}`
  return `ใช้ได้ถึง ${formatThaiShortDate(expiresAt)} · อีก ${formatNumber(daysLeft.value)} วัน`
})
</script>

<template>
  <article class="flex">
    <div
      class="relative flex w-24 shrink-0 flex-col items-center justify-center rounded-2xl px-2 text-center text-white xl:w-[24%]"
      :class="isActive ? 'bg-primary' : 'bg-muted/35'"
    >
      <span class="absolute -top-2.5 -right-2.5 size-5 rounded-full bg-white xl:-top-3 xl:-right-3 xl:size-6" aria-hidden="true" />
      <span class="absolute -right-2.5 -bottom-2.5 size-5 rounded-full bg-white xl:-right-3 xl:-bottom-3 xl:size-6" aria-hidden="true" />
      <span
        class="leading-none"
        :class="coupon.discountType === 'free_shipping' ? 'font-heading text-2xl font-medium xl:text-4xl 2xl:text-[2.75rem]' : 'font-number text-3xl font-semibold xl:text-5xl 2xl:text-[3.5rem]'"
      >{{ formatCouponDiscount(coupon) }}</span>
      <span class="mt-1.5 text-xs text-white/85 xl:mt-2.5 xl:text-base">{{ formatCouponDiscountUnit(coupon) }}</span>
    </div>

    <div class="ml-1.5 flex min-w-0 flex-1 flex-col rounded-2xl border bg-white px-4 py-3.5 xl:ml-2.5 xl:px-6 xl:py-5 2xl:px-7 2xl:py-6">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="font-sans text-base leading-snug font-semibold xl:text-xl 2xl:text-2xl" :class="!isActive && 'text-ink/75'">
            {{ coupon.title }}
          </h3>
          <p class="mt-0.5 text-xs text-muted xl:mt-1 xl:text-sm 2xl:text-base">
            {{ description }}
          </p>
        </div>
        <span
          v-if="statusBadge"
          class="shrink-0 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap xl:px-4 xl:py-1 xl:text-sm"
          :class="statusBadge.class"
        >
          {{ statusBadge.label }}
        </span>
      </div>

      <div class="mt-3 flex items-center gap-3 xl:mt-4 xl:gap-4 2xl:gap-6">
        <button
          v-if="isActive"
          type="button"
          :aria-label="`คัดลอกโค้ด ${coupon.code}`"
          class="flex h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-dashed border-primary/50 bg-cream px-3 text-primary-dark transition-colors hover:bg-primary-soft xl:h-12 xl:max-w-76 xl:px-4 2xl:px-5"
          @click="copy(coupon.code)"
        >
          <span class="truncate font-number text-sm font-semibold tracking-wide xl:text-base 2xl:text-lg">{{ coupon.code }}</span>
          <Icon :name="isCodeCopied ? 'lucide:check' : 'lucide:copy'" class="size-4 shrink-0 xl:size-5" />
        </button>
        <p
          v-else
          class="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-dashed border-primary/20 bg-border/40 px-3 font-number text-sm font-semibold tracking-wide text-ink/75 xl:h-12 xl:max-w-76 xl:px-4 xl:text-base 2xl:px-5 2xl:text-lg"
        >
          <span class="truncate">{{ coupon.code }}</span>
        </p>

        <button
          v-if="isActive"
          type="button"
          class="ml-auto h-10 shrink-0 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:h-12 xl:px-8 xl:text-base 2xl:w-40"
          @click="emit('apply', coupon)"
        >
          ใช้คูปอง
        </button>
      </div>

      <p class="mt-2.5 text-[0.6875rem] xl:mt-3 xl:text-[0.8125rem] 2xl:text-sm" :class="isExpiringSoon ? 'font-semibold text-pending' : 'text-muted'">
        {{ footnote }}
      </p>
      <span class="sr-only" aria-live="polite">{{ isCodeCopied ? `คัดลอกโค้ด ${coupon.code} แล้ว` : '' }}</span>
    </div>
  </article>
</template>
