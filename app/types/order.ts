export type MarketplaceId = 'shopee' | 'tiktok-shop' | 'lazada'

export type PendingOrderStatus = 'verifying' | 'in-return-window'

export interface PendingOrder {
  id: string
  marketplaceId: MarketplaceId
  orderNumber: string
  status: PendingOrderStatus
  points: number
  expectedCreditDate: string | null
}

export type SubmittedOrderStatus = 'approved' | PendingOrderStatus | 'rejected'

export type OrderRejectionReason = 'duplicate' | 'cancelled'

export interface SubmittedOrder {
  id: string
  marketplaceId: MarketplaceId
  orderNumber: string
  // Local date-time (YYYY-MM-DDTHH:mm)
  submittedAt: string
  spendBaht: number | null
  points: number | null
  status: SubmittedOrderStatus
  rejectionReason: OrderRejectionReason | null
  expectedCreditDate: string | null
}

export interface OrderLineItem {
  id: string
  name: string
  quantity: number
  imageUrl: string | null
  totalBaht: number
}

export interface SubmittedOrderDetail extends SubmittedOrder {
  orderedAt: string | null
  pointsMultiplier: number | null
  items: OrderLineItem[]
}

export interface OrderSubmission {
  marketplaceId: MarketplaceId
  orderNumber: string
}

export interface OrderSubmissionResult {
  orderId: string
  marketplaceId: MarketplaceId
  orderNumber: string
  estimatedPoints: number | null
  expectedCreditDate: string | null
}

export type OrderSubmissionFailureReason = 'already_submitted' | 'invalid_order_number' | 'unknown'

export interface OrderSubmissionFailure {
  reason: OrderSubmissionFailureReason
  orderNumber: string
}

export interface OrderNumberGuideField {
  label: string
  value: string
}

export interface OrderNumberGuide {
  marketplaceId: MarketplaceId
  orderNumberPath: string
  orderNumberPlaceholder: string
  sampleOrderNumber: string
  sampleDetails: OrderNumberGuideField[]
  sampleTimeline: OrderNumberGuideField[]
  steps: string[]
}

export type SubmittedOrderFilter = 'all' | 'approved' | 'pending' | 'rejected'

export interface SubmittedOrderQuery {
  filter: SubmittedOrderFilter
  search: string
  page: number
  pageSize: number
}

export interface SubmittedOrderPage {
  orders: SubmittedOrder[]
  totalCount: number
  countByFilter: Record<SubmittedOrderFilter, number>
}
