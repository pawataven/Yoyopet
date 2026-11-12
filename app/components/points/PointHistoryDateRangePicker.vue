<script setup lang="ts">
import type { DateRange } from '~/types/points'

const props = defineProps<{
  today: string
}>()

const dateRange = defineModel<DateRange>({ required: true })

const rootElement = useTemplateRef<HTMLElement>('root')
const triggerButton = useTemplateRef<HTMLButtonElement>('triggerButton')
const popoverId = useId()
const fromFieldId = useId()
const toFieldId = useId()
const { isOpen, toggle: togglePopover, close: closePopover } = usePopover(rootElement, triggerButton)

function startOfMonthsAgo(monthsAgo: number) {
  const today = new Date(`${props.today}T00:00:00`)
  return toLocalIsoDate(new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1))
}

const presets = computed(() => [
  { label: 'เดือนนี้', range: { from: startOfMonthsAgo(0), to: props.today } },
  { label: '2 เดือนล่าสุด', range: { from: startOfMonthsAgo(1), to: props.today } },
  { label: '3 เดือนล่าสุด', range: { from: startOfMonthsAgo(2), to: props.today } },
  { label: '6 เดือนล่าสุด', range: { from: startOfMonthsAgo(5), to: props.today } },
  { label: 'ปีนี้', range: { from: `${props.today.slice(0, 4)}-01-01`, to: props.today } }
])

const draftFrom = ref<string | null>(dateRange.value.from)
const draftTo = ref<string | null>(dateRange.value.to)

watch(isOpen, (open) => {
  if (!open) return
  draftFrom.value = dateRange.value.from
  draftTo.value = dateRange.value.to
})

const canApplyDraft = computed(() => Boolean(draftFrom.value && draftTo.value && draftFrom.value <= draftTo.value))

function isSelectedPreset(range: DateRange) {
  return range.from === dateRange.value.from && range.to === dateRange.value.to
}

function selectRange(range: DateRange) {
  dateRange.value = range
  closePopover({ restoreFocus: true })
}

function applyDraft() {
  if (!draftFrom.value || !draftTo.value || !canApplyDraft.value) return
  selectRange({ from: draftFrom.value, to: draftTo.value })
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      ref="triggerButton"
      type="button"
      :aria-expanded="isOpen"
      :aria-controls="popoverId"
      aria-haspopup="dialog"
      class="flex h-10 items-center gap-2.5 rounded-full border bg-white px-4 text-sm transition-colors hover:border-primary/40 xl:h-11 xl:gap-3 xl:px-5 xl:text-[0.9375rem]"
      @click="togglePopover"
    >
      <span class="sr-only">ช่วงวันที่:</span>
      <Icon name="lucide:calendar" class="size-4 shrink-0 xl:size-5" />
      {{ formatThaiDateRange(dateRange) }}
      <Icon name="lucide:chevron-down" class="size-4 shrink-0 text-muted transition-transform xl:ml-6" :class="isOpen && 'rotate-180'" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        :id="popoverId"
        role="dialog"
        aria-label="เลือกช่วงวันที่"
        class="absolute top-full right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-[1.25rem] border bg-white p-4 shadow-xl shadow-ink/10 xl:p-5"
      >
        <ul class="flex flex-wrap gap-2">
          <li v-for="preset in presets" :key="preset.label">
            <button
              type="button"
              class="flex h-9 items-center rounded-full border px-4 text-sm transition-colors hover:border-primary/40"
              :class="isSelectedPreset(preset.range) && 'border-primary bg-primary font-semibold text-white'"
              :aria-pressed="isSelectedPreset(preset.range)"
              @click="selectRange(preset.range)"
            >
              {{ preset.label }}
            </button>
          </li>
        </ul>

        <hr class="my-4">
        <p class="text-sm font-semibold">
          กำหนดเอง
        </p>
        <div class="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label :for="fromFieldId" class="text-xs text-muted">ตั้งแต่</label>
            <DateField :id="fromFieldId" v-model="draftFrom" :max="draftTo ?? today" class="mt-1" />
          </div>
          <div>
            <label :for="toFieldId" class="text-xs text-muted">ถึง</label>
            <DateField :id="toFieldId" v-model="draftTo" :max="today" class="mt-1" />
          </div>
        </div>
        <button
          type="button"
          :disabled="!canApplyDraft"
          class="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          @click="applyDraft"
        >
          ใช้ช่วงวันที่นี้
        </button>
      </div>
    </Transition>
  </div>
</template>
