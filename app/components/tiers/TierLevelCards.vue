<script setup lang="ts">
import type { MemberTierStatus, TierLevel } from '~/types/member'

const props = defineProps<{
  tierLevels: TierLevel[]
  tierStatus: MemberTierStatus
}>()

const currentTierIndex = computed(() =>
  props.tierLevels.findIndex(level => level.name === props.tierStatus.currentTier)
)

function tierCaption(level: TierLevel, index: number) {
  const threshold = `${formatNumber(level.minPoints)} แต้มขึ้นไป`
  let note: string | null = null
  if (index === currentTierIndex.value) note = 'ระดับปัจจุบันของคุณ'
  else if (index === 0) note = 'เริ่มต้นสมาชิก'
  else if (index === props.tierLevels.length - 1) note = 'ระดับสูงสุด'
  else if (index > currentTierIndex.value) note = `อีก ${formatNumber(level.minPoints - props.tierStatus.qualifyingPoints)} แต้ม`
  return note ? `${threshold} · ${note}` : threshold
}
</script>

<template>
  <section aria-label="ระดับสมาชิกทั้งหมด" class="mt-6 xl:mt-16">
    <ol class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
      <li
        v-for="(level, index) in tierLevels"
        :key="level.name"
        class="relative rounded-[1.25rem] border bg-white p-5 xl:px-7 xl:pt-8 xl:pb-8"
        :class="index === currentTierIndex && 'border-primary'"
        :aria-current="index === currentTierIndex ? 'true' : undefined"
      >
        <span
          v-if="index === currentTierIndex"
          class="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white xl:top-6 xl:right-6 xl:px-3.5 xl:text-sm"
        >
          ระดับของคุณ
        </span>

        <span
          class="flex size-12 items-center justify-center rounded-full xl:size-16"
          :class="index === currentTierIndex ? 'bg-primary text-white' : 'bg-primary-soft text-primary'"
          aria-hidden="true"
        >
          <Icon :name="index === tierLevels.length - 1 ? 'lucide:crown' : 'lucide:award'" class="size-5 xl:size-7" />
        </span>

        <h3 class="mt-4 font-number text-xl leading-tight font-semibold xl:mt-6 xl:text-[2rem]">
          {{ level.name }}
        </h3>
        <p class="mt-1 text-xs text-muted xl:mt-1.5 xl:text-base">
          {{ tierCaption(level, index) }}
        </p>

        <ul class="mt-4 space-y-2.5 border-t pt-4 xl:mt-6 xl:space-y-3.5 xl:pt-6">
          <li v-for="perk in level.perkHighlights" :key="perk" class="flex items-center gap-3 text-sm xl:text-[1.0625rem]">
            <Icon name="lucide:check" class="size-4 shrink-0 text-success" />
            {{ perk }}
          </li>
        </ul>
      </li>
    </ol>
  </section>
</template>
