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

export type RewardRedemptionStatus = 'preparing' | 'shipping' | 'delivered' | 'ready_to_use' | 'used'

export interface RewardRedemption {
  id: string
  rewardName: string
  imageUrl: string | null
  couponValueBaht: number | null
  redeemedAt: string
  status: RewardRedemptionStatus
}
