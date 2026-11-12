<script setup lang="ts">
import type { Reward } from '~/types/reward'

const SPEND_ESTIMATE_ROUNDING_BAHT = 50

const props = withDefaults(defineProps<{
  reward: Reward
  quantity?: number
}>(), {
  quantity: 1
})

const isOpen = defineModel<boolean>('open', { required: true })

const { member } = useMember()
const { earningRule } = usePointsEarningRule()

const memberPoints = computed(() => member.value?.points ?? 0)
const totalPointsCost = computed(() => props.reward.pointsCost * props.quantity)
const pointsShort = computed(() => Math.max(0, totalPointsCost.value - memberPoints.value))
const progressPercent = computed(() => Math.min(100, Math.round((memberPoints.value / totalPointsCost.value) * 100)))

// Rounded up so the estimate never falls short of the points actually needed
const estimatedSpendBaht = computed(() => {
  if (!earningRule.value) return null
  const tierMultiplier = earningRule.value.tierMultipliers.find(rule => rule.tier === member.value?.tier)?.multiplier ?? 1
  const exactSpend = (pointsShort.value * earningRule.value.bahtPerPoint) / tierMultiplier
  return Math.ceil(exactSpend / SPEND_ESTIMATE_ROUNDING_BAHT) * SPEND_ESTIMATE_ROUNDING_BAHT
})

const headingId = useId()
const actions = useTemplateRef('actions')

const buttonBaseClass = 'flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold transition-colors focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:h-14 sm:text-lg'
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-148"
    @opened="actions?.querySelector('a')?.focus()"
  >
    <div class="relative px-5 pt-7 pb-6 text-center sm:px-10 sm:pt-9 sm:pb-10">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border/60 text-ink transition-colors hover:bg-border sm:top-7 sm:right-7 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>

      <div class="relative mx-auto size-24 sm:size-36">
        <span
          v-if="reward.category === 'coupon' && reward.couponValueBaht !== null"
          class="flex size-full items-center justify-center rounded-2xl bg-primary font-number text-3xl font-semibold text-white sm:text-[2.75rem]"
        >
          {{ formatNumber(reward.couponValueBaht) }}
        </span>
        <NuxtImg
          v-else-if="reward.imageUrl"
          :src="reward.imageUrl"
          alt=""
          width="288"
          height="192"
          class="size-full rounded-2xl object-cover"
        />
        <span v-else class="flex size-full items-center justify-center rounded-2xl bg-cream text-primary">
          <Icon name="lucide:gift" class="size-10" />
        </span>
        <span class="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/30" aria-hidden="true">
          <span class="flex size-11 items-center justify-center rounded-full bg-ink/85 text-white sm:size-14">
            <Icon name="lucide:lock" class="size-5 sm:size-6" />
          </span>
        </span>
      </div>

      <h2 :id="headingId" class="mt-5 text-xl leading-tight sm:mt-6 sm:text-[1.75rem]">
        แต้มยังไม่พอ
      </h2>
      <p class="mt-1.5 text-sm text-muted sm:text-base">
        {{ reward.name }}<template v-if="quantity > 1">
          × {{ quantity }}
        </template> ใช้ {{ formatNumber(totalPointsCost) }} แต้ม
      </p>

      <div
        class="mt-6 h-2.5 overflow-hidden rounded-full bg-border sm:mt-8 sm:h-3"
        role="progressbar"
        :aria-valuenow="progressPercent"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="แต้มที่มีเทียบกับแต้มที่ต้องใช้"
      >
        <div class="h-full rounded-full bg-primary" :style="{ width: `${progressPercent}%` }" />
      </div>
      <div class="mt-2.5 flex items-center justify-between gap-4 text-sm sm:mt-3 sm:text-base">
        <span class="text-muted">มี {{ formatNumber(memberPoints) }} แต้ม</span>
        <span class="font-semibold text-primary-dark">ขาดอีก {{ formatNumber(pointsShort) }} แต้ม</span>
      </div>

      <p v-if="estimatedSpendBaht" class="mt-5 text-sm sm:mt-6 sm:text-base">
        ซื้อสินค้าเพิ่มอีกประมาณ {{ formatNumber(estimatedSpendBaht) }} บาท ก็แลกได้แล้ว
      </p>

      <div ref="actions" class="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        <NuxtLink
          to="/orders/submit"
          :class="buttonBaseClass"
          class="bg-primary text-white hover:bg-primary-dark"
          @click="isOpen = false"
        >
          กรอกเลขออเดอร์ รับแต้ม
        </NuxtLink>
        <NuxtLink
          :to="{ path: '/rewards', query: { redeemable: '1' } }"
          :class="buttonBaseClass"
          class="border-2 border-primary text-primary-dark hover:bg-primary-soft"
          @click="isOpen = false"
        >
          ดูของรางวัลที่แลกได้
        </NuxtLink>
      </div>
    </div>
  </ModalDialog>
</template>
