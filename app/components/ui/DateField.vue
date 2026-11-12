<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  placeholder?: string
  max?: string
  describedBy?: string
  invalid?: boolean
}>(), {
  placeholder: 'เลือกวันที่',
  max: undefined,
  describedBy: undefined,
  invalid: false
})

const isoDate = defineModel<string | null>({ required: true })

const inputValue = computed({
  get: () => isoDate.value ?? '',
  set: (value: string) => {
    isoDate.value = value || null
  }
})

function openDatePicker(event: MouseEvent) {
  const input = event.currentTarget as HTMLInputElement
  try {
    input.showPicker()
  } catch {
    // showPicker throws inside cross-origin iframes and is missing in older browsers; the native input still works
  }
}
</script>

<template>
  <!-- The native date input sits invisibly on top so the visible box can show the Thai short date format -->
  <div class="relative">
    <input
      :id="id"
      v-model="inputValue"
      type="date"
      :max="max"
      :aria-describedby="describedBy"
      :aria-invalid="invalid ? 'true' : undefined"
      class="peer absolute inset-0 size-full cursor-pointer opacity-0"
      @click="openDatePicker"
    >
    <div
      class="pointer-events-none flex h-12 w-full items-center justify-between rounded-xl border-2 bg-white px-4 text-base transition-colors peer-focus:border-primary xl:h-14.5 xl:px-5 xl:text-lg"
      :class="invalid ? 'border-primary' : 'border-muted/25'"
      aria-hidden="true"
    >
      <span :class="!isoDate && 'text-muted/60'">
        {{ isoDate ? formatThaiShortDate(isoDate) : placeholder }}
      </span>
      <Icon name="lucide:calendar" class="size-5 text-muted xl:size-6" />
    </div>
  </div>
</template>
