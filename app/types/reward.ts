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
}

export interface RewardRedemptionResult {
  redemptionId: string
  pointsSpent: number
  remainingPoints: number
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
