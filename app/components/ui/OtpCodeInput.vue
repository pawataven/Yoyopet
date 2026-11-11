<script setup lang="ts">
const props = withDefaults(defineProps<{
  length?: number
  isInvalid?: boolean
  label?: string
}>(), {
  length: 6,
  isInvalid: false,
  label: 'รหัส OTP'
})

const code = defineModel<string>({ required: true })

const digitInputs = useTemplateRef<HTMLInputElement[]>('digitInputs')

const digits = computed(() => Array.from({ length: props.length }, (_, index) => code.value[index] ?? ''))

function focusDigit(index: number) {
  const clampedIndex = Math.min(Math.max(index, 0), props.length - 1)
  digitInputs.value?.[clampedIndex]?.focus()
}

// Digits are always filled left to right, so the code never has gaps
function handleFocus(index: number) {
  if (index > code.value.length) focusDigit(code.value.length)
}

function insertDigits(index: number, enteredDigits: string) {
  code.value = (code.value.slice(0, index) + enteredDigits + code.value.slice(index + enteredDigits.length)).slice(0, props.length)
  focusDigit(index + enteredDigits.length)
}

function handleInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  // Typing into a filled box leaves both digits in the value, so prefer the typed key; SMS autofill has no single key
  const typedText = (event as InputEvent).data
  const enteredDigits = digitsOnly(typedText?.length === 1 ? typedText : input.value)
  input.value = digits.value[index] ?? ''
  if (enteredDigits) insertDigits(index, enteredDigits)
}

function handlePaste(index: number, event: ClipboardEvent) {
  const pastedDigits = digitsOnly(event.clipboardData?.getData('text') ?? '')
  if (!pastedDigits) return
  event.preventDefault()
  insertDigits(index, pastedDigits)
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault()
    const deleteIndex = digits.value[index] ? index : index - 1
    if (deleteIndex < 0) return
    code.value = code.value.slice(0, deleteIndex) + code.value.slice(deleteIndex + 1)
    focusDigit(deleteIndex)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusDigit(index - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusDigit(Math.min(index + 1, code.value.length))
  }
}

defineExpose({
  focus: () => focusDigit(code.value.length)
})
</script>

<template>
  <div role="group" :aria-label="label" class="flex gap-2 xl:gap-2.5">
    <input
      v-for="(digit, index) in digits"
      ref="digitInputs"
      :key="index"
      :value="digit"
      type="text"
      inputmode="numeric"
      :autocomplete="index === 0 ? 'one-time-code' : 'off'"
      :aria-label="`${label} หลักที่ ${index + 1}`"
      :aria-invalid="isInvalid ? 'true' : undefined"
      class="aspect-67/77 w-0 min-w-0 flex-1 rounded-xl border-2 bg-white text-center font-number text-2xl font-semibold caret-primary transition-colors focus:border-primary focus:outline-none xl:rounded-[0.875rem] xl:text-[1.75rem]"
      :class="isInvalid ? 'border-primary/60' : 'border-muted/25'"
      @focus="handleFocus(index)"
      @input="handleInput(index, $event)"
      @paste="handlePaste(index, $event)"
      @keydown="handleKeydown(index, $event)"
    >
  </div>
</template>
