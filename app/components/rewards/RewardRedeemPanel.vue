<script setup lang="ts">
import type { RewardDetail } from '~/types/reward'

const props = defineProps<{
  reward: RewardDetail
  memberPoints: number
}>()

const emit = defineEmits<{
  redeem: [quantity: number]
}>()

const quantity = defineModel<number>('quantity', { required: true })

const maxQuantity = computed(() =>
  Math.max(1, Math.min(props.reward.stockRemaining, Math.floor(props.memberPoints / props.reward.pointsCost)))
)
const isOutOfStock = computed(() => props.reward.stockRemaining <= 0)
const totalPointsCost = computed(() => props.reward.pointsCost * quantity.value)
const pointsShort = computed(() => Math.max(0, totalPointsCost.value - props.memberPoints))
const canRedeem = computed(() => !isOutOfStock.value && pointsShort.value === 0)

watch(maxQuantity, (max) => {
  if (quantity.value > max) quantity.value = max
})

const detailRows = computed(() => [
  props.reward.sizeLabel ? { label: 'ขนาด', value: props.reward.sizeLabel, valueClass: '' } : null,
  {
    label: 'เหลือ',
    value: isOutOfStock.value ? 'หมดแล้ว' : `${formatNumber(props.reward.stockRemaining)} ชิ้น`,
    valueClass: 'text-pending'
  },
  {
    label: 'การรับของรางวัล',
    value: props.reward.fulfillment === 'coupon' ? 'เข้า "คูปองของฉัน" ทันที' : 'จัดส่งถึงบ้าน ฟรี',
    valueClass: ''
  },
  props.reward.deliveryLeadTime ? { label: 'ระยะเวลาจัดส่ง', value: props.reward.deliveryLeadTime, valueClass: '' } : null
].filter(row => row !== null))

const quantityLabelId = useId()
const stepButtonClass = 'flex size-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:text-muted/50 disabled:hover:bg-transparent xl:size-10'
</script>

<template>
  <div>
    <p class="text-sm text-muted xl:text-base">
      {{ rewardGroupLabels[reward.group] }} · {{ reward.brand }}
    </p>

    <div class="mt-3 flex items-center gap-4 xl:mt-5">
      <p class="text-[2rem] leading-none font-semibold xl:text-[2.75rem]" :class="canRedeem ? 'text-primary-dark' : 'text-muted'">
        {{ formatNumber(reward.pointsCost) }} แต้ม
      </p>
      <span
        class="flex h-7 items-center rounded-full px-3.5 text-xs font-semibold xl:h-8 xl:px-4 xl:text-sm"
        :class="canRedeem ? 'bg-success/10 text-success' : 'bg-border text-muted'"
      >
        {{ isOutOfStock ? 'หมดแล้ว' : canRedeem ? 'แลกได้' : `ขาดอีก ${formatNumber(pointsShort)}` }}
      </span>
    </div>
    <p class="mt-2 text-sm text-muted xl:mt-3 xl:text-base" aria-live="polite">
      คุณมี {{ formatNumber(memberPoints) }} แต้ม ·
      {{ pointsShort > 0 ? `ขาดอีก ${formatNumber(pointsShort)} แต้ม` : `แลกแล้วเหลือ ${formatNumber(memberPoints - totalPointsCost)} แต้ม` }}
    </p>

    <dl class="mt-5 border-y py-2 xl:mt-7 xl:py-3">
      <div v-for="row in detailRows" :key="row.label" class="flex items-center justify-between gap-4 py-2 text-sm xl:py-2.5 xl:text-base">
        <dt class="text-muted">
          {{ row.label }}
        </dt>
        <dd class="text-right font-semibold" :class="row.valueClass">
          {{ row.value }}
        </dd>
      </div>
    </dl>

    <div class="mt-5 flex items-center gap-5 xl:mt-7 xl:gap-8">
      <span :id="quantityLabelId" class="text-sm xl:text-base">จำนวน</span>
      <div role="group" :aria-labelledby="quantityLabelId" class="flex items-center gap-2 rounded-full border px-1 py-0.5 xl:gap-4">
        <button
          type="button"
          :class="stepButtonClass"
          :disabled="quantity <= 1 || !canRedeem"
          aria-label="ลดจำนวน"
          @click="quantity--"
        >
          <Icon name="lucide:minus" class="size-4" />
        </button>
        <output class="w-6 text-center font-number text-base font-semibold xl:w-8 xl:text-lg" aria-live="polite">{{ quantity }}</output>
        <button
          type="button"
          :class="stepButtonClass"
          :disabled="quantity >= maxQuantity || !canRedeem"
          aria-label="เพิ่มจำนวน"
          @click="quantity++"
        >
          <Icon name="lucide:plus" class="size-4" />
        </button>
      </div>
    </div>

    <div class="mt-5 space-y-3 xl:mt-7">
      <button
        type="button"
        :disabled="!canRedeem"
        class="flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold transition-colors xl:h-14 xl:text-lg"
        :class="canRedeem ? 'bg-primary text-white hover:bg-primary-dark' : 'cursor-not-allowed bg-border text-muted'"
        @click="emit('redeem', quantity)"
      >
        {{ isOutOfStock ? 'ของรางวัลหมดแล้ว' : canRedeem ? 'แลกเลย' : 'แต้มยังไม่พอ' }}
      </button>
      <NuxtLink
        to="/rewards"
        class="flex h-12 w-full items-center justify-center rounded-xl border-2 border-primary text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-14 xl:text-lg"
      >
        กลับหน้าของรางวัล
      </NuxtLink>
    </div>

    <section v-if="reward.highlights.length" aria-labelledby="reward-highlights-heading" class="mt-6 rounded-2xl bg-cream px-5 py-5 xl:mt-8 xl:px-7 xl:py-6">
      <h2 id="reward-highlights-heading" class="font-sans text-base font-semibold xl:text-lg">
        รายละเอียดสินค้า
      </h2>
      <ul class="mt-2 space-y-1 text-sm text-ink/80 xl:mt-3 xl:space-y-1.5 xl:text-base">
        <li v-for="highlight in reward.highlights" :key="highlight" class="before:mr-2 before:content-['•']">
          {{ highlight }}
        </li>
      </ul>
    </section>
  </div>
</template>
