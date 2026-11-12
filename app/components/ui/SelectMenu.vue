          option.description ? 'py-2 xl:py-2.5' : 'h-11 xl:h-12',
<script setup lang="ts" generic="TValue extends string">
const props = defineProps<{
  options: { value: TValue, label: string, description?: string }[]
  // Shown before the selected label on the trigger, e.g. "เรียงตาม: "
  prefix?: string
  icon?: string
  // Accessible name for the trigger and the list
  label: string
}>()

const selectedValue = defineModel<TValue>({ required: true })

const rootElement = useTemplateRef<HTMLElement>('root')
const triggerElement = useTemplateRef<HTMLButtonElement>('trigger')
const listElement = useTemplateRef<HTMLUListElement>('list')
const { isOpen, toggle, close } = usePopover(rootElement, triggerElement)

const listId = useId()
const activeIndex = ref(0)

const selectedOption = computed(() => props.options.find(option => option.value === selectedValue.value))
const optionId = (index: number) => `${listId}-option-${index}`

async function open() {
  if (!isOpen.value) toggle()
  activeIndex.value = Math.max(0, props.options.findIndex(option => option.value === selectedValue.value))
  await nextTick()
  listElement.value?.focus()
}

function choose(index: number) {
  const option = props.options[index]
  if (option) selectedValue.value = option.value
  close({ restoreFocus: true })
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    open()
  }
}

function handleListKeydown(event: KeyboardEvent) {
  const lastIndex = props.options.length - 1
  const nextIndexByKey: Record<string, number> = {
    ArrowDown: Math.min(lastIndex, activeIndex.value + 1),
    ArrowUp: Math.max(0, activeIndex.value - 1),
    Home: 0,
    End: lastIndex
  }
  if (event.key in nextIndexByKey) {
    event.preventDefault()
    activeIndex.value = nextIndexByKey[event.key]!
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    choose(activeIndex.value)
  } else if (event.key === 'Tab') {
    close()
  }
}

function handleTriggerClick() {
  if (isOpen.value) close()
  else open()
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      ref="trigger"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="listId"
      :aria-label="`${label}: ${selectedOption?.label ?? ''}`"
      class="flex h-11 w-full items-center justify-between gap-3 rounded-full border bg-white pr-4 pl-5 text-sm transition-colors hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none xl:h-12 xl:pr-5 xl:pl-6 xl:text-[0.9375rem]"
      :class="isOpen && 'border-primary'"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <span class="flex min-w-0 items-center gap-2.5 xl:gap-3">
        <Icon v-if="icon" :name="icon" class="size-4 shrink-0 xl:size-5" />
        <span class="truncate">{{ prefix }}{{ selectedOption?.label }}</span>
      </span>
      <Icon name="lucide:chevron-down" class="size-4.5 shrink-0 transition-transform" :class="isOpen && 'rotate-180'" />
    </button>

    <ul
      v-show="isOpen"
      :id="listId"
      ref="list"
      role="listbox"
      tabindex="-1"
      :aria-label="label"
      :aria-activedescendant="isOpen ? optionId(activeIndex) : undefined"
      class="absolute top-full right-0 z-20 mt-2 w-full min-w-48 rounded-2xl border bg-white p-1.5 shadow-lg shadow-ink/10 focus:outline-none"
      @keydown="handleListKeydown"
    >
      <li
        v-for="(option, index) in options"
        :id="optionId(index)"
        :key="option.value"
        role="option"
        :aria-selected="option.value === selectedValue"
        class="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 text-sm transition-colors xl:text-[0.9375rem]"
        :class="[
          option.value === selectedValue ? 'font-semibold text-primary-dark' : 'text-ink',
          index === activeIndex || option.value === selectedValue ? 'bg-cream' : '',
          option.description ? 'py-2.5 xl:py-3' : 'h-11 xl:h-12',
        ]"
        @click="choose(index)"
        @pointerenter="activeIndex = index"
      >
        <span v-if="option.description" class="min-w-0">
          <span class="block">{{ option.label }}</span>
          <span class="block text-xs font-normal text-muted">{{ option.description }}</span>
        </span>
        <template v-else>
          {{ option.label }}
        </template>
        <Icon v-if="option.value === selectedValue" name="lucide:check" class="size-4.5 shrink-0" />
      </li>
    </ul>
  </div>
</template>
