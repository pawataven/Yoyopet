import { useRepositories } from '~/repositories'
import { OrderSubmissionError } from '~/repositories/order.repository'
import type { OrderSubmission, OrderSubmissionResult } from '~/types/order'

const submissionErrorMessages: Record<OrderSubmissionError['reason'], string> = {
  already_submitted: 'เลขคำสั่งซื้อนี้ถูกใช้สะสมแต้มไปแล้ว',
  invalid_order_number: 'ไม่พบเลขคำสั่งซื้อนี้ กรุณาตรวจสอบอีกครั้ง'
}

export function useOrderSubmission() {
  const { order: orderRepository } = useRepositories()
  const { userId } = useAuth()
  const { refresh: refreshPendingOrders } = usePendingOrders()
  const { refresh: refreshRecentSubmissions } = useRecentOrderSubmissions()

  const isSubmitting = ref(false)
  const errorMessage = ref<string | null>(null)

  async function submitOrder(submission: OrderSubmission, proofImage: File | null): Promise<OrderSubmissionResult | null> {
    if (!userId.value || isSubmitting.value) return null
    isSubmitting.value = true
    errorMessage.value = null
    try {
      const result = await orderRepository.submitOrder(userId.value, submission, proofImage)
      await Promise.all([refreshPendingOrders(), refreshRecentSubmissions()])
      return result
    } catch (error) {
      errorMessage.value = error instanceof OrderSubmissionError
        ? submissionErrorMessages[error.reason]
        : 'ส่งเลขคำสั่งซื้อไม่สำเร็จ ลองใหม่อีกครั้ง'
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  function clearError() {
    errorMessage.value = null
  }

  return { submitOrder, isSubmitting: readonly(isSubmitting), errorMessage: readonly(errorMessage), clearError }
}
