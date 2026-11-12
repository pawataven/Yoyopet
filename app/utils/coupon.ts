import type { MemberCoupon } from '~/types/coupon'

export const COUPON_EXPIRING_SOON_DAYS = 7

export function formatCouponDiscount(coupon: MemberCoupon) {
  if (coupon.discountType === 'free_shipping') return 'ส่งฟรี'
  return coupon.discountType === 'percent' ? `${coupon.discountValue}%` : formatNumber(coupon.discountValue)
}

export function formatCouponDiscountUnit(coupon: MemberCoupon) {
  if (coupon.discountType === 'free_shipping') return coupon.tierName ?? 'ค่าส่ง'
  return coupon.discountType === 'percent' ? 'ส่วนลด' : 'บาท'
}

export function formatCouponMinSpend(coupon: MemberCoupon) {
  return coupon.minSpendBaht ? `ขั้นต่ำ ${formatNumber(coupon.minSpendBaht)} บาท` : 'ไม่มีขั้นต่ำ'
}

export function formatCouponConditions(coupon: MemberCoupon) {
  return [
    formatCouponMinSpend(coupon),
    coupon.maxDiscountBaht ? `ลดสูงสุด ${formatNumber(coupon.maxDiscountBaht)} บาท` : null,
    coupon.usageNote
  ].filter(Boolean).join(' · ')
}

export function isCouponExpiringSoon(coupon: MemberCoupon, now = new Date()) {
  return coupon.status === 'active' && daysUntilEndOf(coupon.expiresAt, now) <= COUPON_EXPIRING_SOON_DAYS
}

export function couponClosedAt(coupon: MemberCoupon) {
  return coupon.redemption?.usedAt ?? coupon.expiresAt
}
