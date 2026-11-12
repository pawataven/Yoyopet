import type { OrderSubmission, OrderSubmissionResult, PendingOrder } from '~/types/order'

export interface OrderRepository {
  getPendingOrders(memberId: string): Promise<PendingOrder[]>
  submitOrder(memberId: string, submission: OrderSubmission, proofImage: File | null): Promise<OrderSubmissionResult>
}

export class OrderSubmissionError extends Error {
  constructor(readonly reason: 'already_submitted' | 'invalid_order_number') {
    super(reason)
  }
}

const MOCK_MIN_ORDER_NUMBER_LENGTH = 6

export function createMockOrderRepository(): OrderRepository {
  const pendingOrders: PendingOrder[] = [
    {
      id: 'order-tiktok-576293011',
      marketplaceId: 'tiktok-shop',
      orderNumber: '576293011',
      status: 'in-return-window',
      points: 15,
      expectedCreditDate: '2026-11-16'
    },
    {
      id: 'order-lazada-1029384756',
      marketplaceId: 'lazada',
      orderNumber: '1029384756',
      status: 'verifying',
      points: 7,
      expectedCreditDate: null
    }
  ]

  return {
    async getPendingOrders() {
      return pendingOrders.map(order => ({ ...order }))
    },

    // The real implementation must call the backend function that verifies the order with the marketplace and awards points
    async submitOrder(_memberId, { marketplaceId, orderNumber }) {
      const normalizedOrderNumber = orderNumber.trim().toUpperCase()
      if (normalizedOrderNumber.length < MOCK_MIN_ORDER_NUMBER_LENGTH) {
        throw new OrderSubmissionError('invalid_order_number')
      }
      if (pendingOrders.some(order => order.orderNumber === normalizedOrderNumber)) {
        throw new OrderSubmissionError('already_submitted')
      }
      const orderId = `order-${marketplaceId}-${normalizedOrderNumber}`
      pendingOrders.unshift({
        id: orderId,
        marketplaceId,
        orderNumber: normalizedOrderNumber,
        status: 'verifying',
        points: 0,
        expectedCreditDate: null
      })
      return { orderId, marketplaceId, orderNumber: normalizedOrderNumber }
    }
  }
}
