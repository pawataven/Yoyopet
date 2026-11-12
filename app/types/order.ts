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

export interface OrderSubmission {
  marketplaceId: MarketplaceId
  orderNumber: string
}

export interface OrderSubmissionResult {
  orderId: string
  marketplaceId: MarketplaceId
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
