export type CouponDiscountType = 'amount' | 'percent' | 'free_shipping'

export type MemberCouponStatus = 'active' | 'used' | 'expired'

export interface CouponRedemption {
  marketplaceName: string
  orderNumber: string
  usedAt: string
  savedBaht: number
}

export interface MemberCoupon {
  id: string
  title: string
  discountType: CouponDiscountType
  // Ignored for free_shipping coupons
  discountValue: number
  minSpendBaht: number | null
  maxDiscountBaht: number | null
  usageNote: string | null
  // Set when the coupon is a tier perk rather than redeemed with points
  tierName: string | null
  expiresAt: string
  code: string
  status: MemberCouponStatus
  redemption: CouponRedemption | null
}

export interface MemberCouponPreview {
  totalCount: number
  coupons: MemberCoupon[]
}
