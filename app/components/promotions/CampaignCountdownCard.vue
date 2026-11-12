<script setup lang="ts">
const props = defineProps<{
  startsOn: string
  endsOn: string
}>()

// Business rule: a campaign runs until the end of its last day, Thailand time
const deadline = computed(() => new Date(`${props.endsOn}T23:59:59+07:00`))
const { isReady, isFinished, days, hours, minutes } = useCountdown(deadline)

const countdownUnits = computed(() => [
  { label: 'วัน', value: days.value },
  { label: 'ชม.', value: hours.value },
  { label: 'นาที', value: minutes.value }
])
</script>

<template>
  <section aria-labelledby="campaign-period-heading" class="rounded-[1.25rem] bg-primary-soft p-5 xl:px-9 xl:pt-8 xl:pb-10">
    <h2 id="campaign-period-heading" class="text-xl leading-tight xl:text-[1.625rem]">
      ระยะเวลา
    </h2>
    <p class="mt-2 flex items-center gap-2.5 text-sm font-semibold xl:mt-3 xl:text-lg">
      <Icon name="lucide:calendar" class="size-4.5 shrink-0 text-primary-dark xl:size-5" />
      {{ formatThaiDateSpan(startsOn, endsOn, 'long') }}
    </p>

    <p v-if="isFinished" class="mt-5 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-muted xl:mt-7 xl:text-lg">
      แคมเปญสิ้นสุดแล้ว
    </p>
    <template v-else>
      <p class="mt-4 text-xs text-muted xl:mt-9 xl:text-[0.9375rem]">
        เหลืออีก
      </p>
      <ul class="mt-2 flex gap-3 xl:mt-2.5 xl:gap-5" :aria-busy="!isReady">
        <li
          v-for="unit in countdownUnits"
          :key="unit.label"
          class="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-white xl:h-28 xl:w-30"
        >
          <span class="font-number text-[1.75rem] leading-none font-semibold text-primary-dark xl:text-[2.625rem]">
            {{ isReady ? String(unit.value).padStart(2, '0') : '--' }}
          </span>
          <span class="mt-1.5 text-xs text-muted xl:mt-2.5 xl:text-sm">{{ unit.label }}</span>
        </li>
      </ul>
    </template>
  </section>
</template>
