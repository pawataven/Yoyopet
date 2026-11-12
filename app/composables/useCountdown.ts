import type { MaybeRefOrGetter } from 'vue'

const TICK_MS = 30 * 1000
const MS_PER_MINUTE = 60 * 1000
const MINUTES_PER_DAY = 24 * 60

// The clock only starts on the client, so server and first client render agree (isReady stays false until then)
export function useCountdown(deadline: MaybeRefOrGetter<Date | null>) {
  const now = ref<Date | null>(null)
  let tickTimer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    now.value = new Date()
    tickTimer = setInterval(() => (now.value = new Date()), TICK_MS)
  })
  onBeforeUnmount(() => clearInterval(tickTimer))

  const remainingMinutes = computed(() => {
    const deadlineDate = toValue(deadline)
    if (!now.value || !deadlineDate) return null
    return Math.max(0, Math.floor((deadlineDate.getTime() - now.value.getTime()) / MS_PER_MINUTE))
  })

  return {
    isReady: computed(() => remainingMinutes.value !== null),
    isFinished: computed(() => remainingMinutes.value === 0),
    days: computed(() => Math.floor((remainingMinutes.value ?? 0) / MINUTES_PER_DAY)),
    hours: computed(() => Math.floor(((remainingMinutes.value ?? 0) % MINUTES_PER_DAY) / 60)),
    minutes: computed(() => (remainingMinutes.value ?? 0) % 60)
  }
}
