import { useRepositories } from '~/repositories'

export function useRecentPointTransactions(limit = 4) {
  const { points: pointsRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: transactions, status, error, refresh } = useAsyncData(
    `recent-point-transactions-${limit}`,
    () => (userId.value ? pointsRepository.getRecentTransactions(userId.value, limit) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    transactions,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
