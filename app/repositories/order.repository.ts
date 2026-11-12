import type {
  OrderSubmission,
  OrderSubmissionFailureReason,
  OrderSubmissionResult,
  PendingOrder,
  PendingOrderStatus,
  SubmittedOrder,
  SubmittedOrderDetail
} from '~/types/order'

export interface OrderRepository {
  getPendingOrders(memberId: string): Promise<PendingOrder[]>
  getRecentSubmissions(memberId: string, limit: number): Promise<SubmittedOrder[]>
  getSubmittedOrderDetail(memberId: string, orderId: string): Promise<SubmittedOrderDetail | null>
  submitOrder(memberId: string, submission: OrderSubmission, proofImage: File | null): Promise<OrderSubmissionResult>
}

export class OrderSubmissionError extends Error {
  constructor(readonly reason: Exclude<OrderSubmissionFailureReason, 'unknown'>) {
    super(reason)
  }
}

const MOCK_MIN_ORDER_NUMBER_LENGTH = 6
const MOCK_ESTIMATED_POINTS = 12
const MOCK_DAYS_UNTIL_CREDIT = 4

function isPendingStatus(status: SubmittedOrder['status']): status is PendingOrderStatus {
  return status === 'verifying' || status === 'in-return-window'
}

function toLocalDateTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${toLocalIsoDate(date)}T${hours}:${minutes}`
}

export function createMockOrderRepository(): OrderRepository {
  const submittedOrders: SubmittedOrderDetail[] = [
    {
      id: 'order-shopee-250918K3PQ',
      marketplaceId: 'shopee',
      orderNumber: '250918K3PQ',
      orderedAt: '2026-11-05',
      submittedAt: '2026-11-08T10:32',
      spendBaht: 1000,
      pointsMultiplier: 1.2,
      points: 12,
      status: 'approved',
      rejectionReason: null,
      expectedCreditDate: null,
      items: [
        { id: 'item-tofu-litter', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', quantity: 2, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', totalBaht: 780 },
        { id: 'item-berry-spray', name: 'สเปรย์ Berry Cream 60 มล.', quantity: 1, imageUrl: '/rewards/berry-cream-spray-60ml.jpg', totalBaht: 220 }
      ]
    },
    {
      id: 'order-tiktok-576293011',
      marketplaceId: 'tiktok-shop',
      orderNumber: '576293011',
      orderedAt: '2026-11-06',
      submittedAt: '2026-11-09T20:14',
      spendBaht: 1250,
      pointsMultiplier: 1.2,
      points: 15,
      status: 'in-return-window',
      rejectionReason: null,
      expectedCreditDate: '2026-11-16',
      items: [
        { id: 'item-tofu-litter', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', quantity: 2, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', totalBaht: 780 },
        { id: 'item-pet-wipes', name: 'ทิชชู่เปียก Pet Wipes 80 แผ่น', quantity: 4, imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', totalBaht: 470 }
      ]
    },
    {
      id: 'order-lazada-1029384756',
      marketplaceId: 'lazada',
      orderNumber: '1029384756',
      orderedAt: '2026-11-08',
      submittedAt: '2026-11-10T09:05',
      spendBaht: 640,
      pointsMultiplier: 1.2,
      points: 7,
      status: 'verifying',
      rejectionReason: null,
      expectedCreditDate: null,
      items: [
        { id: 'item-pet-wipes', name: 'ทิชชู่เปียก Pet Wipes 80 แผ่น', quantity: 4, imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', totalBaht: 470 },
        { id: 'item-berry-spray', name: 'สเปรย์ Berry Cream 60 มล.', quantity: 1, imageUrl: '/rewards/berry-cream-spray-60ml.jpg', totalBaht: 170 }
      ]
    },
    {
      id: 'order-shopee-250901AB12',
      marketplaceId: 'shopee',
      orderNumber: '250901AB12',
      orderedAt: null,
      submittedAt: '2026-11-01T13:48',
      spendBaht: null,
      pointsMultiplier: null,
      points: null,
      status: 'rejected',
      rejectionReason: 'duplicate',
      expectedCreditDate: null,
      items: []
    },
    {
      id: 'order-shopee-250828XY77',
      marketplaceId: 'shopee',
      orderNumber: '250828XY77',
      orderedAt: '2026-10-25',
      submittedAt: '2026-10-28T18:20',
      spendBaht: 890,
      pointsMultiplier: null,
      points: null,
      status: 'rejected',
      rejectionReason: 'cancelled',
      expectedCreditDate: null,
      items: [
        { id: 'item-tofu-litter', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', quantity: 2, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', totalBaht: 780 },
        { id: 'item-berry-spray', name: 'สเปรย์ Berry Cream 60 มล.', quantity: 1, imageUrl: '/rewards/berry-cream-spray-60ml.jpg', totalBaht: 110 }
      ]
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
      return submittedOrders.slice(0, limit).map(({ orderedAt: _orderedAt, pointsMultiplier: _pointsMultiplier, items: _items, ...order }) => order)
    },

    async getSubmittedOrderDetail(_memberId, orderId) {
      const order = submittedOrders.find(submittedOrder => submittedOrder.id === orderId)
      return order ? { ...order, items: order.items.map(item => ({ ...item })) } : null
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
      const now = new Date()
      const expectedCreditDate = toLocalIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + MOCK_DAYS_UNTIL_CREDIT))
      submittedOrders.unshift({
        id: orderId,
        marketplaceId,
        orderNumber: normalizedOrderNumber,
        orderedAt: null,
        submittedAt: toLocalDateTime(now),
        spendBaht: null,
        pointsMultiplier: null,
        points: MOCK_ESTIMATED_POINTS,
        status: 'verifying',
        rejectionReason: null,
        expectedCreditDate,
        items: []
      })
      return {
        orderId,
        marketplaceId,
        orderNumber: normalizedOrderNumber,
        estimatedPoints: MOCK_ESTIMATED_POINTS,
        expectedCreditDate
      }
    }
  }
}
