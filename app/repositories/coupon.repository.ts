import type { MemberCouponPreview } from '~/types/coupon'

export interface CouponRepository {
  getActiveCouponPreview(memberId: string, limit: number): Promise<MemberCouponPreview>
}

export function createMockCouponRepository(): CouponRepository {
  return {
    async getActiveCouponPreview(_memberId, limit) {
      const coupons = [
        { id: 'coupon-yy50', title: 'ส่วนลด 50 บาท', discountType: 'amount' as const, discountValue: 50, minSpendBaht: 300, expiresAt: '2026-11-30', code: 'YY50-K8Q2' },
        { id: 'coupon-bday-mali', title: 'คูปองวันเกิด 10%', discountType: 'percent' as const, discountValue: 10, minSpendBaht: null, expiresAt: '2026-11-15', code: 'BDAY-MALI10' },
        { id: 'coupon-free-ship', title: 'ส่งฟรี', discountType: 'amount' as const, discountValue: 40, minSpendBaht: 199, expiresAt: '2026-12-15', code: 'SHIP-FREE40' }
      ]
      return { totalCount: coupons.length, coupons: coupons.slice(0, limit) }
    }
  }
}
