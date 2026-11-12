import type { ConsentPurpose } from '~/types/member'
import { useRepositories } from '~/repositories'

export function useMemberConsents() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: consents, status, error, refresh } = useAsyncData(
    'member-consents',
    () => (userId.value ? memberRepository.getConsents(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  // Applied optimistically so the switch responds at once; rolled back if the server refuses
  async function setConsent(purpose: ConsentPurpose, granted: boolean) {
    if (!userId.value || !consents.value) return
    const previous = consents.value
    consents.value = { ...previous, [purpose]: { granted, updatedAt: new Date().toISOString() } }
    try {
      consents.value = await memberRepository.setConsent(userId.value, purpose, granted)
      await refreshNuxtData('member-consent-history')
    } catch (setConsentError) {
      consents.value = previous
      throw setConsentError
    }
  }

  return {
    consents,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    setConsent
  }
}
