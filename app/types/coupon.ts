export type CouponDiscountType = 'amount' | 'percent'

export interface MemberCoupon {
  id: string
  title: string
  discountType: CouponDiscountType
  discountValue: number
  minSpendBaht: number | null
  expiresAt: string
  code: string
}

export interface MemberCouponPreview {
  totalCount: number
  coupons: MemberCoupon[]
}
