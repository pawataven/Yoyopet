import { useRepositories } from '~/repositories'

export function usePointExpirySchedule() {
  const { points: pointsRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: expiryBatches, status, error, refresh } = useAsyncData(
    'point-expiry-schedule',
    () => (userId.value ? pointsRepository.getExpirySchedule(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    expiryBatches,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
