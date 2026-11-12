<script setup lang="ts">
const props = withDefaults(defineProps<{
  dismissible?: boolean
  fullscreen?: boolean | 'mobile'
}>(), {
  dismissible: true,
  fullscreen: false
})

const emit = defineEmits<{
  opened: []
  closed: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const fullscreenLayoutClass = 'm-0 h-dvh max-h-none w-full max-w-none'
const centeredLayoutClass = 'm-auto w-[calc(100%-2rem)] rounded-[1.75rem] shadow-2xl shadow-ink/20 backdrop:bg-ink/50'

const dialogLayoutClass = computed(() => {
  if (props.fullscreen === 'mobile') return 'max-md:m-0 max-md:h-dvh max-md:max-h-none max-md:w-full max-md:max-w-none md:m-auto md:w-[calc(100%-2rem)] md:rounded-[1.75rem] md:shadow-2xl md:shadow-ink/20 md:backdrop:bg-ink/50'
  return props.fullscreen ? fullscreenLayoutClass : centeredLayoutClass
})
const scrollAreaClass = computed(() => {
  if (props.fullscreen === 'mobile') return 'max-md:h-full md:max-h-[calc(100dvh-2rem)]'
  return props.fullscreen ? 'h-full' : 'max-h-[calc(100dvh-2rem)]'
})

const dialogElement = useTemplateRef<HTMLDialogElement>('dialog')

// A dialog's close event fires a task later, so it can arrive after the next dialog has opened; keep the lock while any is open
function lockPageScroll(isLocked: boolean) {
  const hasOtherOpenDialog = document.querySelector('dialog[open]') !== null
  document.documentElement.style.overflow = isLocked || hasOtherOpenDialog ? 'hidden' : ''
}

async function syncDialog(shouldOpen: boolean) {
  const dialog = dialogElement.value
  if (!dialog) return
  if (shouldOpen && !dialog.open) {
    dialog.showModal()
    lockPageScroll(true)
    await nextTick()
    emit('opened')
  } else if (!shouldOpen && dialog.open) {
    dialog.close()
  }
}

watch(isOpen, syncDialog)
onMounted(() => syncDialog(isOpen.value))
onBeforeUnmount(() => {
  dialogElement.value?.close()
  lockPageScroll(false)
})

function handleCancel(event: Event) {
  if (!props.dismissible) event.preventDefault()
}

function handleClose() {
  // Chrome lets a repeated Esc close a modal even when cancel is prevented, so reopen a required dialog
  if (!props.dismissible && isOpen.value) {
    dialogElement.value?.showModal()
    return
  }
  lockPageScroll(false)
  isOpen.value = false
  emit('closed')
}

function handleBackdropClick(event: MouseEvent) {
  if (props.dismissible && event.target === dialogElement.value) isOpen.value = false
}
</script>

<template>
  <dialog
    ref="dialog"
    class="overflow-hidden bg-white text-ink"
    :class="dialogLayoutClass"
    @cancel="handleCancel"
    @close="handleClose"
    @click="handleBackdropClick"
  >
    <!-- The close button sits outside the scroll area so it stays in the corner while the content scrolls -->
    <div v-if="$slots.close" class="absolute inset-x-0 top-0 z-10 h-0">
      <slot name="close" />
    </div>
    <div class="modal-dialog-scroll overflow-y-auto overscroll-contain" :class="scrollAreaClass">
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
/* Thin thumb inset from the edge, with track margins so it never runs into the rounded corners */
.modal-dialog-scroll::-webkit-scrollbar {
  width: 14px;
}

.modal-dialog-scroll::-webkit-scrollbar-track {
  margin-block: 1.75rem;
  background: transparent;
}

.modal-dialog-scroll::-webkit-scrollbar-thumb {
  border: 4px solid transparent;
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--color-muted) 35%, transparent);
  background-clip: padding-box;
}

.modal-dialog-scroll::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(in oklab, var(--color-muted) 55%, transparent);
}

/* Chrome ignores ::-webkit-scrollbar once scrollbar-width is set, so only Firefox gets the standard properties */
@supports not selector(::-webkit-scrollbar) {
  .modal-dialog-scroll {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklab, var(--color-muted) 35%, transparent) transparent;
  }
}
</style>
