const COPIED_FEEDBACK_MS = 2000

export function useClipboardCopy() {
  const copiedKey = ref<string | null>(null)
  let copiedFeedbackTimer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string, key = text) {
    try {
      await navigator.clipboard.writeText(text)
      copiedKey.value = key
      clearTimeout(copiedFeedbackTimer)
      copiedFeedbackTimer = setTimeout(() => (copiedKey.value = null), COPIED_FEEDBACK_MS)
    } catch {
      copiedKey.value = null
    }
  }

  onBeforeUnmount(() => clearTimeout(copiedFeedbackTimer))

  return { copiedKey: readonly(copiedKey), copy }
}
