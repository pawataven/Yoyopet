import { useRepositories } from '~/repositories'

export function useRecommendedRewards() {
  const { reward: rewardRepository } = useRepositories()

  const { data: rewards, status, error, refresh } = useAsyncData(
    'recommended-rewards',
    () => rewardRepository.getRecommendedRewards(),
    { default: () => [] }
  )

  return {
    rewards,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
