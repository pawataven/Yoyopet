import type { OrderSubmission, OrderSubmissionResult, PendingOrder, PendingOrderStatus, SubmittedOrder } from '~/types/order'

export interface OrderRepository {
  getPendingOrders(memberId: string): Promise<PendingOrder[]>
  getRecentSubmissions(memberId: string, limit: number): Promise<SubmittedOrder[]>
  submitOrder(memberId: string, submission: OrderSubmission, proofImage: File | null): Promise<OrderSubmissionResult>
}

export class OrderSubmissionError extends Error {
  constructor(readonly reason: 'already_submitted' | 'invalid_order_number') {
    super(reason)
  }
}

const MOCK_MIN_ORDER_NUMBER_LENGTH = 6

function isPendingStatus(status: SubmittedOrder['status']): status is PendingOrderStatus {
  return status === 'verifying' || status === 'in-return-window'
}

export function createMockOrderRepository(): OrderRepository {
  const submittedOrders: SubmittedOrder[] = [
    {
      id: 'order-shopee-250918K3PQ',
      marketplaceId: 'shopee',
      orderNumber: '250918K3PQ',
      submittedAt: '2026-11-08',
      spendBaht: 1000,
      points: 12,
      status: 'approved',
      rejectionReason: null,
      expectedCreditDate: null
    },
    {
      id: 'order-tiktok-576293011',
      marketplaceId: 'tiktok-shop',
      orderNumber: '576293011',
      submittedAt: '2026-11-09',
      spendBaht: 1250,
      points: 15,
      status: 'in-return-window',
      rejectionReason: null,
      expectedCreditDate: '2026-11-16'
    },
    {
      id: 'order-lazada-1029384756',
      marketplaceId: 'lazada',
      orderNumber: '1029384756',
      submittedAt: '2026-11-10',
      spendBaht: 640,
      points: 7,
      status: 'verifying',
      rejectionReason: null,
      expectedCreditDate: null
    },
    {
      id: 'order-shopee-250901AB12',
      marketplaceId: 'shopee',
      orderNumber: '250901AB12',
      submittedAt: '2026-11-01',
      spendBaht: null,
      points: null,
      status: 'rejected',
      rejectionReason: 'duplicate',
      expectedCreditDate: null
    },
    {
      id: 'order-shopee-250828XY77',
      marketplaceId: 'shopee',
      orderNumber: '250828XY77',
      submittedAt: '2026-10-28',
      spendBaht: 890,
      points: null,
      status: 'rejected',
      rejectionReason: 'cancelled',
      expectedCreditDate: null
    }
  ]

  return {
    async getPendingOrders() {
      return submittedOrders.flatMap(order => isPendingStatus(order.status)
        ? [{
            id: order.id,
            marketplaceId: order.marketplaceId,
            orderNumber: order.orderNumber,
            status: order.status,
            points: order.points ?? 0,
            expectedCreditDate: order.expectedCreditDate
          }]
        : [])
    },

    async getRecentSubmissions(_memberId, limit) {
      return submittedOrders.slice(0, limit).map(order => ({ ...order }))
    },

    // The real implementation must call the backend function that verifies the order with the marketplace and awards points
    async submitOrder(_memberId, { marketplaceId, orderNumber }) {
      const normalizedOrderNumber = orderNumber.trim().toUpperCase()
      if (normalizedOrderNumber.length < MOCK_MIN_ORDER_NUMBER_LENGTH) {
        throw new OrderSubmissionError('invalid_order_number')
      }
      if (submittedOrders.some(order => order.orderNumber === normalizedOrderNumber)) {
        throw new OrderSubmissionError('already_submitted')
      }
      const orderId = `order-${marketplaceId}-${normalizedOrderNumber}`
      submittedOrders.unshift({
        id: orderId,
        marketplaceId,
        orderNumber: normalizedOrderNumber,
        submittedAt: toLocalIsoDate(new Date()),
        spendBaht: null,
        points: null,
        status: 'verifying',
        rejectionReason: null,
        expectedCreditDate: null
      })
      return { orderId, marketplaceId, orderNumber: normalizedOrderNumber }
    }
  }
}
