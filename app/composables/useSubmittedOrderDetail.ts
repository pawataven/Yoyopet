import { useRepositories } from '~/repositories'

export function useSubmittedOrderDetail(orderId: MaybeRefOrGetter<string | null>) {
  const { order: orderRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: orderDetail, status, error, refresh } = useAsyncData(
    () => `submitted-order-detail-${toValue(orderId) ?? 'none'}`,
    () => {
      const id = toValue(orderId)
      return userId.value && id ? orderRepository.getSubmittedOrderDetail(userId.value, id) : Promise.resolve(null)
    },
    { watch: [userId], default: () => null }
  )

  return {
    orderDetail,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
