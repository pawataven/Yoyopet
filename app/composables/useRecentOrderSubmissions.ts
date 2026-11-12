import { useRepositories } from '~/repositories'

const RECENT_SUBMISSION_LIMIT = 5

export function useRecentOrderSubmissions() {
  const { order: orderRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: recentSubmissions, status, error, refresh } = useAsyncData(
    'recent-order-submissions',
    () => (userId.value ? orderRepository.getRecentSubmissions(userId.value, RECENT_SUBMISSION_LIMIT) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    recentSubmissions,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
