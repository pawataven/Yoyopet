import { useRepositories } from '~/repositories'
import type { SubmittedOrderPage, SubmittedOrderQuery } from '~/types/order'

const emptyPage: SubmittedOrderPage = {
  orders: [],
  totalCount: 0,
  countByFilter: { all: 0, approved: 0, pending: 0, rejected: 0 }
}

export function useSubmittedOrders(query: MaybeRefOrGetter<SubmittedOrderQuery>) {
  const { order: orderRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: orderPage, status, error, refresh } = useAsyncData(
    () => {
      const { filter, search, page, pageSize } = toValue(query)
      return `submitted-orders-${filter}-${search}-${page}-${pageSize}`
    },
    () => (userId.value ? orderRepository.getSubmittedOrders(userId.value, toValue(query)) : Promise.resolve(emptyPage)),
    { watch: [userId], default: () => emptyPage }
  )

  return {
    orderPage,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
