import { useRepositories } from '~/repositories'

export function useReferral() {
  const { referral: referralRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: referral, status, error, refresh } = useAsyncData(
    'referral-summary',
    () => (userId.value ? referralRepository.getSummary(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  return {
    referral,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
