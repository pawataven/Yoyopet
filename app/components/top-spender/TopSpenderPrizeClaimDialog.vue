<script setup lang="ts">
import type { TopSpenderPrizeClaim } from '~/types/leaderboard'

const props = defineProps<{
  claim: TopSpenderPrizeClaim
  memberDisplayName: string
}>()

const emit = defineEmits<{
  postponed: []
  confirmed: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { confirmClaim, isConfirming, errorMessage } = useTopSpenderPrizeClaim()
const { addresses, defaultAddressId } = useShippingAddresses()

type ClaimStep = 'congratulate' | 'chooseAddress' | 'confirmed'
const step = ref<ClaimStep>('congratulate')
const confirmedAddressId = ref<string | null>(null)

const memberInitial = computed(() => props.memberDisplayName.trim().charAt(0).toUpperCase())
const medalRingClassByRank: Record<number, string> = {
  1: 'border-medal-gold',
  2: 'border-medal-silver',
  3: 'border-medal-bronze'
}
const confirmedAddress = computed(() => addresses.value.find(address => address.id === confirmedAddressId.value) ?? null)

const headingId = useId()
const confirmButton = useTemplateRef('confirmButton')

async function confirmWithAddress(addressId: string) {
  if (!(await confirmClaim(addressId))) {
    step.value = 'congratulate'
    return
  }
  confirmedAddressId.value = addressId
  step.value = 'confirmed'
}

function handleClosed() {
  if (step.value === 'confirmed') emit('confirmed')
  else emit('postponed')
}

const primaryButtonClass = 'flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-lg'
const outlineButtonClass = 'flex h-12 w-full items-center justify-center rounded-xl border-2 border-primary text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:h-14 sm:text-lg'
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :dismissible="!isConfirming"
    :aria-labelledby="headingId"
    :class="step === 'chooseAddress' ? 'max-w-208' : 'max-w-lg'"
    @opened="confirmButton?.focus()"
    @closed="handleClosed"
  >
    <div class="px-5 pt-6 pb-6 sm:px-10 sm:pt-9 sm:pb-8">
      <RewardAddressPicker
        v-if="step === 'chooseAddress'"
        :addresses="addresses"
        :selected-address-id="defaultAddressId ?? addresses[0]?.id ?? null"
        :heading-id="headingId"
        @apply="confirmWithAddress"
        @cancel="step = 'congratulate'"
        @navigate="isOpen = false"
      />

      <template v-else-if="step === 'confirmed'">
        <div class="pt-2 text-center sm:pt-3">
          <SuccessCheckmark />
          <h2 :id="headingId" class="mt-5 text-xl leading-tight sm:mt-7 sm:text-[1.75rem]">
            ยืนยันรับของรางวัลแล้ว
          </h2>
          <p class="mt-1.5 text-sm text-muted sm:text-base">
            เราจะจัดส่ง{{ claim.prize.name }}ให้ฟรีทั่วประเทศ
          </p>
        </div>
        <p v-if="confirmedAddress" class="mt-5 text-xs text-muted sm:mt-6 sm:text-sm">
          จัดส่งถึง: {{ formatThaiAddress(confirmedAddress) }}
        </p>
        <div class="mt-6 space-y-3 sm:mt-8">
          <NuxtLink to="/coupons" :class="primaryButtonClass" @click="isOpen = false">
            ดูคูปองของฉัน
          </NuxtLink>
          <button type="button" :class="outlineButtonClass" @click="isOpen = false">
            ปิด
          </button>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col items-center text-center">
          <Icon name="lucide:crown" class="size-8 text-medal-gold sm:size-10" aria-hidden="true" />
          <span class="relative mt-2 sm:mt-3" aria-hidden="true">
            <span
              class="flex size-20 items-center justify-center rounded-full border-3 bg-primary-soft font-sans text-[1.75rem] font-semibold text-primary-dark sm:size-28 sm:border-4 sm:text-[2.25rem]"
              :class="medalRingClassByRank[claim.rank]"
            >
              {{ memberInitial }}
            </span>
            <span
              class="absolute -right-0.5 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-white font-number text-sm font-semibold sm:size-8"
              :class="topSpenderMedalClassByRank[claim.rank]"
            >
              {{ claim.rank }}
            </span>
          </span>
          <h2 :id="headingId" class="mt-4 font-sans text-xl leading-tight font-semibold sm:mt-5 sm:text-[1.75rem]">
            ยินดีด้วย! คุณได้อันดับ {{ claim.rank }}
          </h2>
          <p class="mt-1 text-sm text-muted sm:text-base">
            Top Spender เดือน{{ formatThaiLongMonthYear(claim.month) }}
          </p>
        </div>

        <div class="mt-5 flex items-center gap-4 rounded-2xl bg-cream p-3 sm:mt-6 sm:p-4">
          <NuxtImg
            :src="claim.prize.imageUrl"
            alt=""
            width="192"
            height="192"
            class="size-16 shrink-0 rounded-xl bg-white object-cover sm:size-24"
          />
          <div class="min-w-0">
            <p class="font-semibold sm:text-lg">
              {{ claim.prize.name }}
            </p>
            <p class="mt-0.5 text-sm text-primary-dark sm:mt-1 sm:text-base">
              + คูปองส่วนลด {{ formatNumber(claim.prize.bonusCouponBaht) }} บาท
            </p>
          </div>
        </div>

        <p class="mt-4 text-sm font-semibold text-pending sm:mt-5 sm:text-base">
          ยืนยันที่อยู่จัดส่งภายใน {{ formatThaiShortDate(claim.confirmBy) }}
        </p>
        <p v-if="errorMessage" class="mt-2 text-sm text-primary-dark" role="alert">
          {{ errorMessage }}
        </p>

        <div class="mt-4 space-y-3 sm:mt-5">
          <button
            ref="confirmButton"
            type="button"
            :disabled="isConfirming"
            :class="primaryButtonClass"
            @click="step = 'chooseAddress'"
          >
            ยืนยันรับของรางวัล
          </button>
          <button type="button" :class="outlineButtonClass" @click="isOpen = false">
            ไว้ทีหลัง
          </button>
        </div>
        <p class="mt-4 text-center text-xs text-muted sm:mt-5 sm:text-sm">
          คูปองเข้า "คูปองของฉัน" อัตโนมัติ
        </p>
      </template>
    </div>
  </ModalDialog>
</template>
