const SNOOZE_DAYS = 7
const SNOOZE_MS = SNOOZE_DAYS * 24 * 60 * 60 * 1000
const SNOOZE_STORAGE_KEY_PREFIX = 'yoyo:line-friend-prompt-snoozed-until:'

// Storage can throw in private mode or when site data is blocked; the prompt then simply shows again next visit
function readSnoozedUntil(memberId: string) {
  try {
    return Number(localStorage.getItem(SNOOZE_STORAGE_KEY_PREFIX + memberId)) || 0
  } catch {
    return 0
  }
}

function writeSnoozedUntil(memberId: string, timestamp: number) {
  try {
    localStorage.setItem(SNOOZE_STORAGE_KEY_PREFIX + memberId, String(timestamp))
  } catch {
    // Ignored on purpose: see readSnoozedUntil
  }
}

export function useLineFriendPrompt() {
  const { userId } = useAuth()
  const { dashboard } = useMemberDashboard()
  const { isOnboardingRequired } = useMemberOnboarding()
  const { lineOfficialAccount } = useAppConfig()

  // Read during setup, not onMounted: the dialog child mounts first and would flash open for a snoozed member
  const snoozedUntil = ref(0)
  if (import.meta.client) {
    watch(userId, (memberId) => {
      snoozedUntil.value = memberId ? readSnoozedUntil(memberId) : 0
    }, { immediate: true })
  }

  // Client-only so the server never renders a sheet the visitor already snoozed
  const isPromptVisible = computed(() =>
    import.meta.client
    && Boolean(userId.value)
    && !isOnboardingRequired.value
    && dashboard.value?.isLineOfficialAccountFriend === false
    && snoozedUntil.value <= Date.now()
  )

  function snooze() {
    if (!userId.value) return
    snoozedUntil.value = Date.now() + SNOOZE_MS
    writeSnoozedUntil(userId.value, snoozedUntil.value)
  }

  // LINE reports the new friendship to the backend by webhook, so the prompt only needs to step aside here
  function openAddFriend() {
    window.open(lineOfficialAccount.addFriendUrl, '_blank', 'noopener')
    snooze()
  }

  return { isPromptVisible, snooze, openAddFriend }
}
