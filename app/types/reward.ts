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

export type RewardRedemptionStatus = 'preparing' | 'shipping' | 'delivered' | 'ready_to_use' | 'used'

export interface RewardRedemption {
  id: string
  rewardName: string
  imageUrl: string | null
  couponValueBaht: number | null
  redeemedAt: string
  status: RewardRedemptionStatus
}
