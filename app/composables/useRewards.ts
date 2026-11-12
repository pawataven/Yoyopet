import { useRepositories } from '~/repositories'

export function useRewards() {
  const { reward: rewardRepository } = useRepositories()

  const { data: rewards, status, error, refresh } = useAsyncData(
    'rewards',
    () => rewardRepository.getRewards(),
    { default: () => [] }
  )

  return {
    rewards,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
