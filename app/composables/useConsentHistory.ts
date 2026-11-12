import { useRepositories } from '~/repositories'

export function useConsentHistory() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  // Most members never open the history, so it loads only when asked for
  const { data: history, status, error, execute } = useAsyncData(
    'member-consent-history',
    () => (userId.value ? memberRepository.getConsentHistory(userId.value) : Promise.resolve([])),
    { immediate: false, server: false, default: () => [] }
  )

  return {
    history,
    isLoading: computed(() => status.value === 'pending'),
    hasLoaded: computed(() => status.value === 'success'),
    error,
    load: execute
  }
}
