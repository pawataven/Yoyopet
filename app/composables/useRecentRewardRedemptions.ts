import { useRepositories } from '~/repositories'

export function useRecentRewardRedemptions(limit = 2) {
  const { reward: rewardRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: redemptions, status, error, refresh } = useAsyncData(
    `recent-reward-redemptions-${limit}`,
    () => (userId.value ? rewardRepository.getRecentRedemptions(userId.value, limit) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    redemptions,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
