<script setup lang="ts">
import type { RewardGroup } from '~/types/reward'

const POINT_STEP = 50

const props = defineProps<{
  maxPoints: number
  countByGroup: Record<RewardGroup, number>
}>()

const isRedeemableOnly = defineModel<boolean>('redeemableOnly', { required: true })
const minPoints = defineModel<number>('minPoints', { required: true })
const maxPointsFilter = defineModel<number>('maxPointsFilter', { required: true })
const selectedGroups = defineModel<RewardGroup[]>('groups', { required: true })

const fieldId = useId()

const minPointsInput = ref('')
const maxPointsInput = ref('')

watch(minPoints, value => (minPointsInput.value = formatNumber(value)), { immediate: true })
watch(maxPointsFilter, value => (maxPointsInput.value = formatNumber(value)), { immediate: true })

function parsePoints(text: string) {
  const digits = text.replace(/\D/g, '')
  return digits ? Number(digits) : null
}

function commitMinPoints() {
  const parsed = parsePoints(minPointsInput.value)
  minPoints.value = parsed === null ? 0 : Math.min(Math.max(0, parsed), maxPointsFilter.value)
  minPointsInput.value = formatNumber(minPoints.value)
}

function commitMaxPoints() {
  const parsed = parsePoints(maxPointsInput.value)
  maxPointsFilter.value = parsed === null ? props.maxPoints : Math.max(Math.min(props.maxPoints, parsed), minPoints.value)
  maxPointsInput.value = formatNumber(maxPointsFilter.value)
}

function clearFilters() {
  isRedeemableOnly.value = false
  selectedGroups.value = []
  minPoints.value = 0
  maxPointsFilter.value = props.maxPoints
}

const pointsFieldClass = 'h-11 w-full min-w-0 rounded-xl border bg-white px-3 text-center text-sm transition-colors focus:border-primary focus:outline-none xl:text-base'
</script>

<template>
  <section aria-labelledby="reward-filter-heading" class="rounded-[1.25rem] border bg-white px-5 xl:px-7">
    <div class="flex items-center justify-between gap-4 border-b py-5 xl:py-6">
      <h2 id="reward-filter-heading" class="flex items-center gap-2.5 text-lg leading-tight xl:text-[1.375rem]">
        <Icon name="lucide:filter" class="size-5 shrink-0" />
        ตัวกรอง
      </h2>
      <button
        type="button"
        class="text-sm font-semibold text-primary-dark hover:underline xl:text-[0.9375rem]"
        @click="clearFilters"
      >
        ล้างทั้งหมด
      </button>
    </div>

    <label class="flex cursor-pointer items-center justify-between gap-3 border-b py-4 text-sm xl:py-5 xl:text-base">
      แสดงเฉพาะที่แลกได้
      <ToggleSwitch v-model="isRedeemableOnly" />
    </label>

    <fieldset class="border-b py-5 xl:py-6">
      <legend class="float-left w-full text-sm font-semibold xl:text-base">
        ช่วงแต้ม
      </legend>
      <RangeSlider
        v-model:lower="minPoints"
        v-model:upper="maxPointsFilter"
        :min="0"
        :max="maxPoints"
        :step="POINT_STEP"
        min-label="แต้มต่ำสุด"
        max-label="แต้มสูงสุด"
        class="clear-both pt-4"
      />
      <div class="mt-4 flex items-center gap-3">
        <label :for="`${fieldId}-min`" class="sr-only">แต้มต่ำสุด</label>
        <input
          :id="`${fieldId}-min`"
          v-model="minPointsInput"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :class="pointsFieldClass"
          @change="commitMinPoints"
        >
        <span class="text-muted" aria-hidden="true">–</span>
        <label :for="`${fieldId}-max`" class="sr-only">แต้มสูงสุด</label>
        <input
          :id="`${fieldId}-max`"
          v-model="maxPointsInput"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :class="pointsFieldClass"
          @change="commitMaxPoints"
        >
      </div>
    </fieldset>

    <fieldset class="py-5 xl:py-6">
      <legend class="float-left w-full text-sm font-semibold xl:text-base">
        ประเภท
      </legend>
      <div class="clear-both space-y-3 pt-4 xl:space-y-0 xl:pt-3">
        <label
          v-for="group in rewardGroupOrder"
          :key="group"
          class="flex cursor-pointer items-center gap-3 text-sm xl:min-h-11.5 xl:text-base"
        >
          <span class="relative flex size-5 shrink-0">
            <input
              v-model="selectedGroups"
              type="checkbox"
              :value="group"
              class="peer size-full cursor-pointer appearance-none rounded-md border-2 border-muted/30 bg-white transition-colors checked:border-primary checked:bg-primary hover:border-primary/60 focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none"
            >
            <Icon name="lucide:check" class="pointer-events-none absolute inset-0.5 size-4 text-white opacity-0 peer-checked:opacity-100" />
          </span>
          <span class="flex-1">{{ rewardGroupLabels[group] }}</span>
          <span class="text-xs text-muted xl:text-sm">({{ formatNumber(countByGroup[group]) }})</span>
        </label>
      </div>
    </fieldset>
  </section>
</template>
