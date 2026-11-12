import { useRepositories } from '~/repositories'
import { OrderSubmissionError } from '~/repositories/order.repository'
import type { OrderSubmission, OrderSubmissionFailure, OrderSubmissionResult } from '~/types/order'

export function useOrderSubmission() {
  const { order: orderRepository } = useRepositories()
  const { userId } = useAuth()
  const { refresh: refreshPendingOrders } = usePendingOrders()
  const { refresh: refreshRecentSubmissions } = useRecentOrderSubmissions()

  const isSubmitting = ref(false)

  async function submitOrder(
    submission: OrderSubmission,
    proofImage: File | null
  ): Promise<{ result: OrderSubmissionResult } | { failure: OrderSubmissionFailure } | null> {
    if (!userId.value || isSubmitting.value) return null
    isSubmitting.value = true
    try {
      const result = await orderRepository.submitOrder(userId.value, submission, proofImage)
      await Promise.all([refreshPendingOrders(), refreshRecentSubmissions()])
      return { result }
    } catch (error) {
      return {
        failure: {
          reason: error instanceof OrderSubmissionError ? error.reason : 'unknown',
          orderNumber: submission.orderNumber.trim().toUpperCase()
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { submitOrder, isSubmitting: readonly(isSubmitting) }
}
