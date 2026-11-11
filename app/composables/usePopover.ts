import type { Ref } from 'vue'

export function usePopover(rootElement: Readonly<Ref<HTMLElement | null>>, triggerElement: Readonly<Ref<HTMLElement | null>>) {
  const isOpen = ref(false)
  const route = useRoute()

  function close({ restoreFocus = false } = {}) {
    isOpen.value = false
    if (restoreFocus) triggerElement.value?.focus()
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function handleDocumentPointerDown(event: PointerEvent) {
    if (rootElement.value && !rootElement.value.contains(event.target as Node)) close()
  }

  function handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close({ restoreFocus: true })
  }

  function removeDocumentListeners() {
    document.removeEventListener('pointerdown', handleDocumentPointerDown)
    document.removeEventListener('keydown', handleDocumentKeydown)
  }

  watch(isOpen, (open) => {
    if (open) {
      document.addEventListener('pointerdown', handleDocumentPointerDown)
      document.addEventListener('keydown', handleDocumentKeydown)
    } else {
      removeDocumentListeners()
    }
  })

  watch(() => route.fullPath, () => close())

  onBeforeUnmount(removeDocumentListeners)

  return { isOpen: readonly(isOpen), toggle, close }
}
