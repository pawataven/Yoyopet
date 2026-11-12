import { useRepositories } from '~/repositories'

export function useShipmentTracking(redemptionId: MaybeRefOrGetter<string | null>) {
  const { reward: rewardRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: tracking, status, error, refresh } = useAsyncData(
    () => `shipment-tracking-${toValue(redemptionId) ?? 'none'}`,
    () => {
      const id = toValue(redemptionId)
      return userId.value && id ? rewardRepository.getShipmentTracking(userId.value, id) : Promise.resolve(null)
    },
    { watch: [userId], default: () => null }
  )

  return {
    tracking,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
