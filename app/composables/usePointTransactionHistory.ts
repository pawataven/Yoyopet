import type { Ref } from 'vue'
import type { DateRange } from '~/types/points'
import { useRepositories } from '~/repositories'

export function usePointTransactionHistory(dateRange: Ref<DateRange>) {
  const { points: pointsRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: transactions, status, error, refresh } = useAsyncData(
    () => `point-transaction-history-${dateRange.value.from}-${dateRange.value.to}`,
    () => (userId.value ? pointsRepository.getTransactionHistory(userId.value, dateRange.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    transactions,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
