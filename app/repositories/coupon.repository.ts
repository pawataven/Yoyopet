import type { MemberCoupon, MemberCouponPreview } from '~/types/coupon'

export interface CouponRepository {
  getActiveCouponPreview(memberId: string, limit: number): Promise<MemberCouponPreview>
  getMemberCoupons(memberId: string): Promise<MemberCoupon[]>
}

export function createMockCouponRepository(): CouponRepository {
  const coupons: MemberCoupon[] = [
    { id: 'coupon-yy50', title: 'ส่วนลด 50 บาท', discountType: 'amount', discountValue: 50, minSpendBaht: 300, maxDiscountBaht: null, usageNote: 'ใช้ได้ทุกช่องทาง', tierName: null, expiresAt: '2026-11-30', code: 'YY50-K8Q2', status: 'active', redemption: null },
    { id: 'coupon-bday-mali', title: 'คูปองวันเกิดน้องมะลิ 10%', discountType: 'percent', discountValue: 10, minSpendBaht: null, maxDiscountBaht: 100, usageNote: null, tierName: null, expiresAt: '2026-11-15', code: 'BDAY-MALI10', status: 'active', redemption: null },
    { id: 'coupon-ship-buddy', title: 'คูปองส่งฟรี สิทธิ์ระดับ Buddy', discountType: 'free_shipping', discountValue: 0, minSpendBaht: 199, maxDiscountBaht: null, usageNote: 'เดือนละ 1 ครั้ง', tierName: 'Buddy', expiresAt: '2026-11-30', code: 'SHIP-BUDDY11', status: 'active', redemption: null },
    { id: 'coupon-yy50-used', title: 'ส่วนลด 50 บาท', discountType: 'amount', discountValue: 50, minSpendBaht: 300, maxDiscountBaht: null, usageNote: 'ใช้ได้ทุกช่องทาง', tierName: null, expiresAt: '2026-11-15', code: 'YY50-2KD1', status: 'used', redemption: { marketplaceName: 'Shopee', orderNumber: '250901AB12', usedAt: '2026-11-01', savedBaht: 50 } },
    { id: 'coupon-ship-oct', title: 'คูปองส่งฟรี สิทธิ์ระดับ Buddy', discountType: 'free_shipping', discountValue: 0, minSpendBaht: 199, maxDiscountBaht: null, usageNote: 'เดือนละ 1 ครั้ง', tierName: 'Buddy', expiresAt: '2026-10-31', code: 'SHIP-BUDDY10', status: 'used', redemption: { marketplaceName: 'TikTok Shop', orderNumber: '560019922', usedAt: '2026-10-28', savedBaht: 40 } },
    { id: 'coupon-yy100-used', title: 'ส่วนลด 100 บาท', discountType: 'amount', discountValue: 100, minSpendBaht: 600, maxDiscountBaht: null, usageNote: 'ใช้ได้ทุกช่องทาง', tierName: null, expiresAt: '2026-11-11', code: 'YY100-P0Q1', status: 'used', redemption: { marketplaceName: 'Lazada', orderNumber: '1029001234', usedAt: '2026-10-15', savedBaht: 100 } },
    { id: 'coupon-bday-mind', title: 'คูปองวันเกิดคุณมายด์ 10%', discountType: 'percent', discountValue: 10, minSpendBaht: null, maxDiscountBaht: 300, usageNote: null, tierName: null, expiresAt: '2026-02-28', code: 'BDAY-MIND10', status: 'used', redemption: { marketplaceName: 'Shopee', orderNumber: '250214KK01', usedAt: '2026-02-14', savedBaht: 260 } },
    { id: 'coupon-welcome', title: 'คูปองต้อนรับสมาชิกใหม่ 5%', discountType: 'percent', discountValue: 5, minSpendBaht: null, maxDiscountBaht: 50, usageNote: null, tierName: null, expiresAt: '2026-10-31', code: 'WELCOME5', status: 'expired', redemption: null }
  ]

  return {
    async getActiveCouponPreview(_memberId, limit) {
      const activeCoupons = coupons.filter(coupon => coupon.status === 'active')
      return { totalCount: activeCoupons.length, coupons: activeCoupons.slice(0, limit) }
    },
    async getMemberCoupons() {
      return coupons
    }
  }
}
