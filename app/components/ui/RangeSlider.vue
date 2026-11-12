<script setup lang="ts">
const props = withDefaults(defineProps<{
  min: number
  max: number
  step?: number
  minLabel: string
  maxLabel: string
}>(), {
  step: 1
})

const lowerValue = defineModel<number>('lower', { required: true })
const upperValue = defineModel<number>('upper', { required: true })

function toPercent(value: number) {
  return ((value - props.min) / (props.max - props.min)) * 100
}

function updateLower(event: Event) {
  lowerValue.value = Math.min(Number((event.target as HTMLInputElement).value), upperValue.value)
}

function updateUpper(event: Event) {
  upperValue.value = Math.max(Number((event.target as HTMLInputElement).value), lowerValue.value)
}
</script>

<template>
  <!-- Two native range inputs stacked on one track: keyboard and screen-reader support come for free, and only the thumbs take pointer events -->
  <div class="range-slider relative h-6">
    <div class="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" aria-hidden="true" />
    <div
      class="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
      :style="{ left: `${toPercent(lowerValue)}%`, right: `${100 - toPercent(upperValue)}%` }"
      aria-hidden="true"
    />
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="lowerValue"
      :aria-label="minLabel"
      class="range-slider__input"
      @input="updateLower"
    >
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="upperValue"
      :aria-label="maxLabel"
      class="range-slider__input"
      @input="updateUpper"
    >
  </div>
</template>

<style scoped>
.range-slider__input {
  position: absolute;
  inset: 0;
  width: 100%;
  appearance: none;
  background: transparent;
  pointer-events: none;
}

.range-slider__input::-webkit-slider-thumb {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  border: 2px solid var(--color-primary);
  background: var(--color-white);
  cursor: pointer;
  pointer-events: auto;
}

.range-slider__input::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  border: 2px solid var(--color-primary);
  background: var(--color-white);
  cursor: pointer;
  pointer-events: auto;
}

.range-slider__input:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}

.range-slider__input:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}
</style>
