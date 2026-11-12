<script setup lang="ts">
const { title, description, confirmLabel, icon = 'lucide:circle-alert', isSubmitting = false } = defineProps<{
  title: string
  description: string
  confirmLabel: string
  icon?: string
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const headingId = useId()
const descriptionId = `${headingId}-description`
const cancelButton = useTemplateRef<HTMLButtonElement>('cancelButton')
</script>

<template>
  <!-- Focus starts on "cancel" so a stray Enter can't confirm a destructive action -->
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    :aria-describedby="descriptionId"
    role="alertdialog"
    class="max-w-80 sm:max-w-110"
    @opened="cancelButton?.focus()"
  >
    <div class="px-5 pt-6 pb-6 text-center sm:p-10">
      <span class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary sm:size-16" aria-hidden="true">
        <Icon :name="icon" class="size-6 sm:size-7" />
      </span>
      <h2 :id="headingId" class="mt-4 text-xl leading-tight sm:mt-5 sm:text-[1.625rem]">
        {{ title }}
      </h2>
      <p :id="descriptionId" class="mt-1.5 text-xs text-muted sm:mt-2 sm:text-[1.0625rem]">
        {{ description }}
      </p>

      <div class="mt-5 grid grid-cols-2 gap-3 sm:mt-8">
        <button
          ref="cancelButton"
          type="button"
          :disabled="isSubmitting"
          class="h-12 rounded-full border-2 border-border bg-white text-[0.9375rem] font-semibold text-ink transition-colors hover:border-primary hover:text-primary-dark disabled:opacity-60 sm:h-14 sm:text-lg"
          @click="isOpen = false"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          class="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:h-14 sm:text-lg"
          @click="emit('confirm')"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-circle" class="size-5 animate-spin" />
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </ModalDialog>
</template>
