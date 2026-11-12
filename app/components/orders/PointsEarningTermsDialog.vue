<script setup lang="ts">
import type { PointsEarningRule } from '~/types/help'

const props = defineProps<{
  earningRule: PointsEarningRule | null
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const headingId = useId()
const acknowledgeButton = useTemplateRef<HTMLButtonElement>('acknowledgeButton')

const termSections = computed(() => buildPointsEarningTermSections(props.earningRule))
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-240"
    @opened="acknowledgeButton?.focus()"
  >
    <div class="relative px-5 pt-6 pb-6 sm:px-11 sm:pt-11 sm:pb-10">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border text-ink transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:top-6 sm:right-6 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-4.5 sm:size-5" />
      </button>

      <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.75rem]">
        เงื่อนไขการสะสมแต้ม
      </h2>

      <TermSectionList :sections="termSections" class="mt-5 sm:mt-8" />
    </div>

    <footer class="sticky bottom-0 flex justify-end border-t bg-white px-5 py-4 sm:px-11 sm:py-6">
      <button
        ref="acknowledgeButton"
        type="button"
        class="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-10 text-base font-semibold text-white transition-colors hover:bg-primary-dark sm:h-14 sm:w-62 sm:text-lg"
        @click="isOpen = false"
      >
        รับทราบ
      </button>
    </footer>
  </ModalDialog>
</template>
