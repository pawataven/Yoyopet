import { useRepositories } from '~/repositories'

export function useTopSpenderPrizeClaim() {
  const { leaderboard: leaderboardRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: pendingClaim, refresh } = useAsyncData(
    'top-spender-pending-prize-claim',
    () => (userId.value ? leaderboardRepository.getPendingPrizeClaim(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  // "Later" only hides the prompt for this visit; the claim stays pending until the member confirms
  const postponedClaimMonth = useState<string | null>('top-spender-prize-claim-postponed', () => null)
  const shouldPromptClaim = computed(() => pendingClaim.value !== null && pendingClaim.value.month !== postponedClaimMonth.value)

  const isConfirming = ref(false)
  const errorMessage = ref<string | null>(null)

  function postponeClaim() {
    postponedClaimMonth.value = pendingClaim.value?.month ?? null
  }

  async function confirmClaim(shippingAddressId: string) {
    const claim = pendingClaim.value
    if (!userId.value || !claim || isConfirming.value) return false
    isConfirming.value = true
    errorMessage.value = null
    try {
      await leaderboardRepository.confirmPrizeClaim(userId.value, claim.month, shippingAddressId)
      return true
    } catch {
      errorMessage.value = 'ยืนยันรับของรางวัลไม่สำเร็จ ลองใหม่อีกครั้ง'
      return false
    } finally {
      isConfirming.value = false
    }
  }

  return {
    pendingClaim,
    shouldPromptClaim,
    postponeClaim,
    confirmClaim,
    refresh,
    isConfirming: readonly(isConfirming),
    errorMessage: readonly(errorMessage)
  }
}
