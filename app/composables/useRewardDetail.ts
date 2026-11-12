import { useRepositories } from '~/repositories'

export function useRewardDetail(rewardId: MaybeRefOrGetter<string>) {
  const { reward: rewardRepository } = useRepositories()

  const { data: rewardDetail, status, error, refresh } = useAsyncData(
    () => `reward-detail-${toValue(rewardId)}`,
    () => rewardRepository.getRewardDetail(toValue(rewardId)),
    { default: () => null }
  )

  return {
    rewardDetail,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
