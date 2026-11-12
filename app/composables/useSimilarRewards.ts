import { useRepositories } from '~/repositories'

export function useSimilarRewards(rewardId: MaybeRefOrGetter<string>, limit = 4) {
  const { reward: rewardRepository } = useRepositories()

  const { data: similarRewards, status, error } = useAsyncData(
    () => `similar-rewards-${toValue(rewardId)}-${limit}`,
    () => rewardRepository.getSimilarRewards(toValue(rewardId), limit),
    { default: () => [] }
  )

  return {
    similarRewards,
    isLoading: computed(() => status.value === 'pending'),
    error
  }
}
