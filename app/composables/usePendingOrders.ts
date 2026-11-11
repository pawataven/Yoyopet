import { useRepositories } from '~/repositories'

export function usePendingOrders() {
  const { order: orderRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: pendingOrders, status, error, refresh } = useAsyncData(
    'pending-orders',
    () => (userId.value ? orderRepository.getPendingOrders(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    pendingOrders,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
