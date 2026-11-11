<script setup lang="ts">
import type { TierLevel, TierProgress } from '~/types/member'

const props = defineProps<{
  tierLevels: TierLevel[]
  tierProgress: TierProgress
}>()

const currentTierIndex = computed(() =>
  Math.max(0, props.tierLevels.findIndex(level => level.name === props.tierProgress.currentTier))
)
const currentTierLevel = computed(() => props.tierLevels[currentTierIndex.value])

const lastStepIndex = computed(() => Math.max(1, props.tierLevels.length - 1))
const filledTrackPercent = computed(() => {
  const partialStep = props.tierProgress.nextTier ? props.tierProgress.progressPercent / 100 : 0
  return Math.min(100, ((currentTierIndex.value + partialStep) / lastStepIndex.value) * 100)
})

function stepPositionPercent(index: number) {
  return (index / lastStepIndex.value) * 100
}
</script>

<template>
  <section aria-labelledby="member-tier-heading" class="flex flex-col rounded-[1.25rem] border bg-white p-5 xl:p-10">
    <h2 id="member-tier-heading" class="text-lg leading-tight xl:text-[1.75rem]">
      ระดับสมาชิก
    </h2>
    <p class="mt-1 text-xs text-muted xl:text-[1.0625rem]">
      คิดจากยอดซื้อสะสม 12 เดือนล่าสุด
    </p>

    <div class="mx-8 mt-8 mb-14 xl:mx-4.5 xl:mt-11 xl:mb-13">
      <ol class="relative h-7 xl:h-9" :aria-label="`ระดับปัจจุบัน ${tierProgress.currentTier}`">
        <span class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border xl:h-0.75" aria-hidden="true" />
        <span
          class="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full bg-primary xl:h-0.75"
          :style="{ width: `${filledTrackPercent}%` }"
          aria-hidden="true"
        />
        <li
          v-for="(level, index) in tierLevels"
          :key="level.name"
          class="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          :style="{ left: `${stepPositionPercent(index)}%` }"
          :aria-current="index === currentTierIndex ? 'step' : undefined"
        >
          <span
            class="flex size-7 items-center justify-center rounded-full xl:size-9"
            :class="[
              index <= currentTierIndex ? 'bg-primary text-white' : 'border-2 border-border bg-white',
              index === currentTierIndex && 'ring-4 ring-primary-soft xl:ring-6'
            ]"
          >
            <Icon v-if="index <= currentTierIndex" name="lucide:check" class="size-3.5 xl:size-4.5" />
          </span>
          <span
            class="mt-2 text-xs font-semibold whitespace-nowrap xl:mt-3.5 xl:text-[1.1875rem]"
            :class="index === currentTierIndex ? 'text-primary-dark' : 'text-ink'"
          >
            {{ level.name }}
          </span>
          <span class="text-[0.6875rem] whitespace-nowrap text-muted xl:text-sm">
            {{ formatNumber(level.minPoints) }} แต้ม
          </span>
        </li>
      </ol>
    </div>

    <div v-if="currentTierLevel" class="mt-auto rounded-2xl bg-cream px-5 py-5 xl:px-7 xl:pt-6 xl:pb-8">
      <h3 class="text-base xl:text-xl">
        สิทธิ์ของระดับ {{ currentTierLevel.name }}
      </h3>
      <ul class="mt-3 space-y-2.5 xl:mt-3.5 xl:space-y-3.5">
        <li v-for="benefit in currentTierLevel.benefits" :key="benefit" class="flex items-center gap-3 text-sm xl:gap-3.5 xl:text-[1.0625rem]">
          <Icon name="lucide:check" class="size-4 shrink-0 text-success" />
          {{ benefit }}
        </li>
      </ul>
    </div>
  </section>
</template>
