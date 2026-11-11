export type RewardCategory = 'coupon' | 'product' | 'privilege'

export interface Reward {
  id: string
  name: string
  category: RewardCategory
  pointsCost: number
  imageUrl: string | null
  couponValueBaht: number | null
}
