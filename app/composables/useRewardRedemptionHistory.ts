import { useRepositories } from '~/repositories'

export function useRewardRedemptionHistory(since: MaybeRefOrGetter<string>) {
  const { reward: rewardRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: redemptions, status, error, refresh } = useAsyncData(
    () => `reward-redemption-history-${toValue(since)}`,
    () => (userId.value ? rewardRepository.getRedemptionHistory(userId.value, toValue(since)) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    redemptions,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
