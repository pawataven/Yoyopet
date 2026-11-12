export type RewardCategory = 'coupon' | 'product' | 'privilege'
export type RewardGroup = 'coupon' | 'cat_litter' | 'cleaning' | 'grooming' | 'cat_toy'
export type RewardBadge = 'new' | 'best_seller'

export interface Reward {
  id: string
  name: string
  category: RewardCategory
  group: RewardGroup
  badge: RewardBadge | null
  pointsCost: number
  imageUrl: string | null
  couponValueBaht: number | null
  // Drives the "ยอดนิยม" sort
  redemptionCount: number
  addedAt: string
}

export type RewardFulfillment = 'coupon' | 'delivery'

export interface RewardDetail extends Reward {
  tagline: string | null
  brand: string
  imageUrls: string[]
  sizeLabel: string | null
  stockRemaining: number
  fulfillment: RewardFulfillment
  deliveryLeadTime: string | null
  highlights: string[]
  couponMinSpendBaht: number | null
  // Days the coupon stays usable after redemption
  couponValidDays: number | null
}

export interface RedeemedCoupon {
  code: string
  expiresAt: string
  minSpendBaht: number | null
}

export interface RewardRedemptionResult {
  redemptionId: string
  // Shown to members and support staff, e.g. RW-2611-0042
  referenceCode: string
  pointsSpent: number
  remainingPoints: number
  // One coupon per redeemed quantity; empty for delivered products
  coupons: RedeemedCoupon[]
}

export type ShipmentStage = 'redeemed' | 'preparing' | 'handed_to_carrier' | 'in_transit' | 'delivered'

export interface ShipmentStageEvent {
  stage: ShipmentStage
  // Local date-time (YYYY-MM-DDTHH:mm); null until the stage is reached
  occurredAt: string | null
}

export interface ShipmentTracking {
  redemptionId: string
  carrierName: string
  trackingNumber: string | null
  currentStage: ShipmentStage
  estimatedDeliveryDate: string | null
  // Every stage in delivery order, including ones not reached yet
  stages: ShipmentStageEvent[]
}

export type RewardRedemptionStatus = 'preparing' | 'shipping' | 'delivered' | 'ready_to_use' | 'used' | 'expired'

export interface RewardRedemption {
  id: string
  rewardId: string
  // Redemption number for products (RW-2611-0042), coupon code for coupons
  referenceCode: string
  pointsSpent: number
  rewardName: string
  imageUrl: string | null
  couponValueBaht: number | null
  redeemedAt: string
  status: RewardRedemptionStatus
}
