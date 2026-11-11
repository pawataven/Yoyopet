<script setup lang="ts">
const props = withDefaults(defineProps<{
  dismissible?: boolean
}>(), {
  dismissible: true
})

const emit = defineEmits<{
  opened: []
  closed: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

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
    class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] bg-white text-ink shadow-2xl shadow-ink/20 backdrop:bg-ink/50"
    @cancel="handleCancel"
    @close="handleClose"
    @click="handleBackdropClick"
  >
    <slot />
  </dialog>
</template>
