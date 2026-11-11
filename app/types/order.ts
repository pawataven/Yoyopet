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
