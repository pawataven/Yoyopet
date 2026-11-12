<script setup lang="ts">
import type { RewardRedemption } from '~/types/reward'

const props = defineProps<{
  redemption: RewardRedemption
}>()

const isCoupon = computed(() => props.redemption.couponValueBaht !== null)
const statusAppearance = computed(() => rewardRedemptionStatusAppearance[props.redemption.status])
const isTrackable = computed(() => props.redemption.status === 'shipping')

// Mounted on first open so the history list doesn't fetch tracking for every row
const hasOpenedTrackingDialog = ref(false)
const isTrackingDialogOpen = ref(false)

function openTrackingDialog() {
  hasOpenedTrackingDialog.value = true
  isTrackingDialogOpen.value = true
}

const actionButtonClass = 'flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold transition-colors sm:w-36 xl:h-12 xl:w-40 xl:text-base'
</script>

<template>
  <li class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-4 sm:grid-cols-[auto_minmax(0,1fr)_7rem_7rem_auto] xl:grid-cols-[auto_minmax(0,1fr)_10rem_10rem_auto] xl:gap-x-6 xl:py-4">
    <span
      v-if="isCoupon"
      class="flex size-14 shrink-0 items-center justify-center rounded-xl font-number text-lg font-semibold text-white xl:size-19 xl:text-2xl"
      :class="redemption.status === 'expired' ? 'bg-muted/35' : 'bg-primary'"
      aria-hidden="true"
    >
      {{ formatNumber(redemption.couponValueBaht!) }}
    </span>
    <NuxtImg
      v-else-if="redemption.imageUrl"
      :src="redemption.imageUrl"
      alt=""
      width="144"
      height="96"
      class="size-14 shrink-0 rounded-xl object-cover xl:size-19"
    />
    <span v-else class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-cream text-primary xl:size-19" aria-hidden="true">
      <Icon name="lucide:gift" class="size-6" />
    </span>

    <div class="min-w-0">
      <p class="truncate text-sm font-semibold xl:text-lg">
        {{ redemption.rewardName }}
      </p>
      <p class="mt-0.5 text-xs text-muted xl:text-sm">
        {{ redemption.referenceCode }} · {{ formatThaiShortDate(redemption.redeemedAt) }}
      </p>
    </div>

    <p class="text-right text-sm font-semibold whitespace-nowrap text-primary-dark sm:text-left xl:text-lg">
      −{{ formatNumber(redemption.pointsSpent) }} แต้ม
    </p>

    <div class="col-span-2 col-start-2 flex items-center justify-between gap-3 sm:contents">
      <span class="flex h-6 w-fit items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap xl:h-7 xl:text-sm" :class="statusAppearance.class">
        {{ statusAppearance.label }}
      </span>

      <button
        v-if="isTrackable"
        type="button"
        :class="actionButtonClass"
        class="max-w-36 bg-primary text-white hover:bg-primary-dark sm:max-w-none"
        @click="openTrackingDialog"
      >
        ติดตามพัสดุ
      </button>
      <NuxtLink
        v-else-if="redemption.status === 'ready_to_use'"
        to="/coupons"
        :class="actionButtonClass"
        class="max-w-36 bg-primary text-white hover:bg-primary-dark sm:max-w-none"
      >
        ใช้คูปอง
      </NuxtLink>
      <NuxtLink
        v-else
        :to="isCoupon ? '/coupons' : `/rewards/${redemption.rewardId}`"
        :aria-label="`ดูรายละเอียด ${redemption.rewardName}`"
        :class="actionButtonClass"
        class="max-w-36 border-2 border-primary text-primary-dark hover:bg-primary-soft sm:max-w-none"
      >
        ดูรายละเอียด
      </NuxtLink>
    </div>

    <ShipmentTrackingDialog
      v-if="hasOpenedTrackingDialog"
      v-model:open="isTrackingDialogOpen"
      :redemption="redemption"
    />
  </li>
</template>
