<script setup lang="ts">
import type { RewardDetail, RewardRedemptionResult } from '~/types/reward'

const props = defineProps<{
  reward: RewardDetail
  quantity: number
  memberPoints: number
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { redeem, isRedeeming, errorMessage, clearError } = useRewardRedemption()
const { addresses, defaultAddressId } = useShippingAddresses()
const { copiedKey, copy } = useClipboardCopy()

const redemptionResult = ref<RewardRedemptionResult | null>(null)
const selectedAddressId = ref<string | null>(null)
const isChoosingAddress = ref(false)

const needsShippingAddress = computed(() => props.reward.fulfillment === 'delivery')
const isCouponReward = computed(() => props.reward.category === 'coupon' && props.reward.couponValueBaht !== null)
const couponConditions = computed(() => [
  props.reward.couponMinSpendBaht ? `ขั้นต่ำ ${formatNumber(props.reward.couponMinSpendBaht)} บาท` : 'ไม่มีขั้นต่ำ',
  props.reward.couponValidDays ? `ใช้ได้ ${props.reward.couponValidDays} วันหลังแลก` : null,
  props.quantity > 1 ? `จำนวน ${props.quantity} ใบ` : null
].filter(Boolean).join(' · '))
const selectedAddress = computed(() => addresses.value.find(address => address.id === selectedAddressId.value) ?? null)
const totalPointsCost = computed(() => props.reward.pointsCost * props.quantity)
const canConfirm = computed(() => !isRedeeming.value && (!needsShippingAddress.value || selectedAddress.value !== null))

const headingId = useId()
const confirmButton = useTemplateRef('confirmButton')
const successActions = useTemplateRef('successActions')

watch(isOpen, (open) => {
  if (!open) return
  redemptionResult.value = null
  isChoosingAddress.value = false
  selectedAddressId.value = defaultAddressId.value ?? addresses.value[0]?.id ?? null
  clearError()
})

function applyAddress(addressId: string) {
  selectedAddressId.value = addressId
  isChoosingAddress.value = false
}

async function confirmRedemption() {
  if (!canConfirm.value) return
  redemptionResult.value = await redeem(props.reward.id, props.quantity, needsShippingAddress.value ? selectedAddressId.value : null)
  if (redemptionResult.value) {
    await nextTick()
    successActions.value?.querySelector('a')?.focus()
  }
}

const outlineButtonClass = 'flex h-12 w-full items-center justify-center rounded-xl border-2 border-primary text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft disabled:opacity-60 sm:h-14 sm:text-lg'
const primaryButtonClass = 'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-lg'
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :dismissible="!isRedeeming"
    :aria-labelledby="headingId"
    :class="isCouponReward || redemptionResult ? 'max-w-148' : 'max-w-208'"
    @opened="confirmButton?.focus()"
  >
    <div class="relative px-5 pt-6 pb-6 sm:px-10 sm:pt-9 sm:pb-10">
      <button
        type="button"
        aria-label="ปิด"
        :disabled="isRedeeming"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border/60 text-ink transition-colors hover:bg-border sm:top-7 sm:right-7 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>

      <template v-if="redemptionResult">
        <div class="pt-2 text-center sm:pt-3">
          <SuccessCheckmark />
          <h2 :id="headingId" class="mt-5 text-xl leading-tight sm:mt-7 sm:text-[1.75rem]">
            {{ redemptionResult.coupons.length ? 'แลกคูปองสำเร็จ!' : 'แลกสำเร็จ!' }}
          </h2>
          <p class="mt-1.5 text-sm text-muted sm:text-base">
            <template v-if="redemptionResult.coupons.length">
              {{ reward.name }} เข้า "คูปองของฉัน" แล้ว
            </template>
            <template v-else>
              เราจะจัดส่งภายใน {{ reward.deliveryLeadTime ?? '3–5 วันทำการ' }}
            </template>
          </p>
        </div>

        <template v-if="!redemptionResult.coupons.length">
          <div class="mt-6 flex items-center gap-4 rounded-2xl bg-cream p-3 sm:mt-8 sm:gap-5 sm:p-4">
            <NuxtImg
              v-if="reward.imageUrls[0]"
              :src="reward.imageUrls[0]"
              alt=""
              width="192"
              height="128"
              class="size-16 shrink-0 rounded-xl bg-white object-cover sm:size-24"
            />
            <span v-else class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white text-primary sm:size-24" aria-hidden="true">
              <Icon name="lucide:gift" class="size-7" />
            </span>
            <div class="min-w-0">
              <p class="font-semibold sm:text-lg">
                {{ reward.name }}<template v-if="quantity > 1">
                  × {{ quantity }}
                </template>
              </p>
              <p class="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">
                เลขที่การแลก {{ redemptionResult.referenceCode }}
              </p>
              <p class="mt-0.5 text-sm font-semibold text-primary-dark sm:mt-1 sm:text-base">
                − {{ formatNumber(redemptionResult.pointsSpent) }} แต้ม
              </p>
            </div>
          </div>
          <p v-if="selectedAddress" class="mt-4 text-xs text-muted sm:mt-5 sm:text-sm">
            จัดส่งถึง: {{ formatThaiAddress(selectedAddress) }}
          </p>
        </template>

        <ul v-if="redemptionResult.coupons.length" class="mt-6 space-y-4 sm:mt-8">
          <li v-for="coupon in redemptionResult.coupons" :key="coupon.code">
            <div class="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-cream py-3 pr-3 pl-5 sm:py-3.5 sm:pr-4 sm:pl-8">
              <span class="truncate font-number text-xl font-semibold tracking-wide text-primary-dark sm:text-[1.75rem]">{{ coupon.code }}</span>
              <button
                type="button"
                class="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-white px-5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:h-13 sm:px-8 sm:text-base"
                @click="copy(coupon.code)"
              >
                <Icon v-if="copiedKey === coupon.code" name="lucide:check" class="size-4" />
                {{ copiedKey === coupon.code ? 'คัดลอกแล้ว' : 'คัดลอก' }}
              </button>
            </div>
            <p class="mt-3 text-center text-xs text-muted sm:mt-4 sm:text-sm">
              ใช้ได้ถึง {{ formatThaiShortDate(coupon.expiresAt) }} ·
              {{ coupon.minSpendBaht ? `ขั้นต่ำ ${formatNumber(coupon.minSpendBaht)} บาท` : 'ไม่มีขั้นต่ำ' }}
            </p>
          </li>
        </ul>
        <span class="sr-only" aria-live="polite">{{ copiedKey ? `คัดลอกโค้ด ${copiedKey} แล้ว` : '' }}</span>

        <div ref="successActions" class="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          <NuxtLink
            v-if="redemptionResult.coupons.length"
            to="/coupons"
            :class="primaryButtonClass"
            @click="isOpen = false"
          >
            ดูคูปองของฉัน
          </NuxtLink>
          <NuxtLink
            v-else
            to="/rewards/history"
            :class="primaryButtonClass"
            @click="isOpen = false"
          >
            ติดตามการจัดส่ง
          </NuxtLink>
          <NuxtLink to="/rewards" :class="outlineButtonClass" @click="isOpen = false">
            {{ redemptionResult.coupons.length ? 'แลกของรางวัลต่อ' : 'กลับหน้าของรางวัล' }}
          </NuxtLink>
        </div>
        <p class="mt-5 text-center text-xs text-muted sm:mt-6 sm:text-sm">
          แต้มคงเหลือ {{ formatNumber(redemptionResult.remainingPoints) }} แต้ม
        </p>
      </template>

      <RewardAddressPicker
        v-else-if="isChoosingAddress"
        :addresses="addresses"
        :selected-address-id="selectedAddressId"
        :heading-id="headingId"
        @apply="applyAddress"
        @cancel="isChoosingAddress = false"
        @navigate="isOpen = false"
      />

      <template v-else-if="isCouponReward">
        <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.75rem]">
          ยืนยันการแลกคูปอง
        </h2>

        <CouponArtwork :value-baht="reward.couponValueBaht!" class="mt-5 aspect-15/8 w-full sm:mt-6" />

        <p class="mt-5 font-semibold sm:mt-6 sm:text-lg">
          {{ reward.name }}
        </p>
        <p class="mt-0.5 text-xs text-muted sm:text-sm">
          {{ couponConditions }}
        </p>

        <dl class="mt-4 space-y-2 rounded-2xl bg-border/40 px-5 py-4 text-sm sm:mt-5 sm:px-6 sm:text-base">
          <div class="flex justify-between gap-4">
            <dt class="text-muted">
              ใช้แลก
            </dt>
            <dd class="font-semibold text-primary-dark">
              − {{ formatNumber(totalPointsCost) }} แต้ม
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted">
              เหลือหลังแลก
            </dt>
            <dd class="font-semibold">
              {{ formatNumber(memberPoints - totalPointsCost) }} แต้ม
            </dd>
          </div>
        </dl>

        <p v-if="errorMessage" role="alert" class="mt-3 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary-dark">
          {{ errorMessage }}
        </p>

        <div class="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">
          <button type="button" :disabled="isRedeeming" :class="outlineButtonClass" class="max-sm:order-2" @click="isOpen = false">
            ยกเลิก
          </button>
          <button
            ref="confirmButton"
            type="button"
            :disabled="!canConfirm"
            :class="primaryButtonClass"
            @click="confirmRedemption"
          >
            <Icon v-if="isRedeeming" name="lucide:loader-circle" class="size-5 animate-spin" />
            ยืนยันแลก
          </button>
        </div>
      </template>

      <template v-else>
        <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.75rem]">
          ยืนยันการแลกของรางวัล
        </h2>

        <div class="mt-5 flex items-center gap-4 border-b pb-5 sm:mt-7 sm:gap-6 sm:pb-6">
          <NuxtImg
            v-if="reward.imageUrls[0]"
            :src="reward.imageUrls[0]"
            alt=""
            width="192"
            height="128"
            class="size-16 shrink-0 rounded-xl object-cover sm:size-24"
          />
          <span v-else class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-cream text-primary sm:size-24" aria-hidden="true">
            <Icon name="lucide:gift" class="size-7" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold sm:text-lg">
              {{ reward.name }}
            </p>
            <p class="mt-0.5 text-base font-semibold text-primary-dark sm:mt-1 sm:text-xl">
              {{ formatNumber(reward.pointsCost) }} แต้ม
            </p>
          </div>
          <p class="shrink-0 self-end text-sm text-muted sm:text-base">
            จำนวน {{ quantity }}
          </p>
        </div>

        <section v-if="needsShippingAddress" aria-labelledby="redeem-shipping-address-heading" class="mt-5 sm:mt-6">
          <div class="flex items-center justify-between gap-4">
            <h3 id="redeem-shipping-address-heading" class="font-sans text-base font-semibold sm:text-xl">
              ที่อยู่จัดส่ง
            </h3>
            <button
              v-if="addresses.length"
              type="button"
              class="text-sm font-semibold text-primary-dark hover:underline sm:text-base"
              @click="isChoosingAddress = true"
            >
              เปลี่ยน
            </button>
          </div>

          <div v-if="selectedAddress" class="mt-3 flex items-start gap-3 rounded-2xl border border-primary/40 bg-cream px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
            <Icon name="lucide:truck" class="mt-0.5 size-5 shrink-0 text-primary-dark sm:size-6" />
            <div class="min-w-0 text-sm sm:text-base">
              <p class="font-semibold sm:text-lg">
                {{ selectedAddress.recipientName }} · {{ selectedAddress.phone }}
              </p>
              <p class="mt-1 text-muted">
                {{ formatThaiAddress(selectedAddress) }}
              </p>
            </div>
          </div>

          <div v-else class="mt-3 rounded-2xl border border-dashed border-primary/40 px-4 py-4 text-sm sm:px-6 sm:text-base">
            <p class="text-muted">
              ยังไม่มีที่อยู่จัดส่ง
            </p>
            <NuxtLink to="/profile" class="mt-1 inline-block font-semibold text-primary-dark hover:underline" @click="isOpen = false">
              เพิ่มที่อยู่ในหน้าโปรไฟล์ ›
            </NuxtLink>
          </div>
        </section>

        <dl class="mt-5 rounded-2xl bg-border/40 px-5 py-4 text-sm sm:mt-8 sm:px-6 sm:py-5 sm:text-base">
          <div class="flex justify-between gap-4">
            <dt class="text-muted">
              แต้มคงเหลือ
            </dt>
            <dd>{{ formatNumber(memberPoints) }} แต้ม</dd>
          </div>
          <div class="mt-2 flex justify-between gap-4 border-b pb-3 sm:pb-4">
            <dt class="text-muted">
              ใช้แลก
            </dt>
            <dd class="font-semibold text-primary-dark">
              − {{ formatNumber(totalPointsCost) }} แต้ม
            </dd>
          </div>
          <div class="mt-3 flex justify-between gap-4 sm:mt-4">
            <dt class="text-muted">
              เหลือหลังแลก
            </dt>
            <dd class="font-semibold">
              {{ formatNumber(memberPoints - totalPointsCost) }} แต้ม
            </dd>
          </div>
        </dl>

        <p class="mt-4 text-xs text-muted sm:mt-5 sm:text-sm">
          แลกแล้วยกเลิกหรือคืนแต้มไม่ได้
        </p>
        <p v-if="errorMessage" role="alert" class="mt-3 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary-dark">
          {{ errorMessage }}
        </p>

        <div class="mt-6 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4">
          <button type="button" :disabled="isRedeeming" :class="outlineButtonClass" class="max-sm:order-2" @click="isOpen = false">
            ยกเลิก
          </button>
          <button
            ref="confirmButton"
            type="button"
            :disabled="!canConfirm"
            :class="primaryButtonClass"
            @click="confirmRedemption"
          >
            <Icon v-if="isRedeeming" name="lucide:loader-circle" class="size-5 animate-spin" />
            ยืนยันแลก {{ formatNumber(totalPointsCost) }} แต้ม
          </button>
        </div>
      </template>
    </div>
  </ModalDialog>
</template>
