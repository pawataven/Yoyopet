import { useRepositories } from '~/repositories'

export function usePointsSummary() {
  const { points: pointsRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: summary, status, error, refresh } = useAsyncData(
    'points-summary',
    () => (userId.value ? pointsRepository.getSummary(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  return {
    summary,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
