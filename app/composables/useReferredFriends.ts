import { useRepositories } from '~/repositories'

export function useReferredFriends() {
  const { referral: referralRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: referredFriends, status, error, refresh } = useAsyncData(
    'referred-friends',
    () => (userId.value ? referralRepository.getReferredFriends(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    referredFriends,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
