import type { DateRange, PointExpiryBatch, PointsSummary, PointTransaction } from '~/types/points'

export interface PointsRepository {
  getRecentTransactions(memberId: string, limit: number): Promise<PointTransaction[]>
  // Confirmed transactions only, newest first; pending orders are not part of the ledger yet
  getTransactionHistory(memberId: string, dateRange: DateRange): Promise<PointTransaction[]>
  getSummary(memberId: string): Promise<PointsSummary>
  getExpirySchedule(memberId: string): Promise<PointExpiryBatch[]>
}

export function createMockPointsRepository(): PointsRepository {
  const transactions: PointTransaction[] = [
    { id: 'tx-1', kind: 'order', status: 'confirmed', title: 'สั่งซื้อผ่าน Shopee', reference: '250918K3PQ', occurredAt: '2026-11-08', points: 12 },
    { id: 'tx-2', kind: 'order', status: 'pending', title: 'รอยืนยัน · TikTok Shop', reference: '576293011', occurredAt: '2026-11-09', points: 15 },
    { id: 'tx-3', kind: 'coupon_redemption', status: 'confirmed', title: 'แลกคูปองส่วนลด 50 บาท', reference: null, occurredAt: '2026-11-05', points: -300 },
    { id: 'tx-4', kind: 'referral', status: 'confirmed', title: 'ชวนเพื่อนสมัครสมาชิก', reference: null, occurredAt: '2026-11-02', points: 50 },
    { id: 'tx-5', kind: 'reward_redemption', status: 'confirmed', title: 'แลกทรายเต้าหู้ YoYo Tofu 7 ลิตร', reference: null, occurredAt: '2026-11-03', points: -900 },
    { id: 'tx-6', kind: 'order', status: 'confirmed', title: 'สั่งซื้อผ่าน TikTok Shop', reference: '560019922', occurredAt: '2026-10-28', points: 38 },
    { id: 'tx-7', kind: 'order', status: 'confirmed', title: 'สั่งซื้อผ่าน Lazada', reference: '1029001234', occurredAt: '2026-10-15', points: 24 },
    { id: 'tx-8', kind: 'expiry', status: 'confirmed', title: 'แต้มหมดอายุ', reference: null, occurredAt: '2026-10-01', points: -40 },
    { id: 'tx-9', kind: 'birthday_bonus', status: 'confirmed', title: 'โบนัสวันเกิดน้องขนมปัง', reference: null, occurredAt: '2026-10-01', points: 100 },
    { id: 'tx-10', kind: 'order', status: 'confirmed', title: 'สั่งซื้อผ่าน Shopee', reference: '250822M7XA', occurredAt: '2026-09-22', points: 45 },
    { id: 'tx-11', kind: 'coupon_redemption', status: 'confirmed', title: 'แลกคูปองส่งฟรี', reference: null, occurredAt: '2026-09-10', points: -340 },
    { id: 'tx-12', kind: 'order', status: 'confirmed', title: 'สั่งซื้อผ่าน Lazada', reference: '1028770561', occurredAt: '2026-08-30', points: 60 }
  ]

  return {
    async getRecentTransactions(_memberId, limit) {
      return transactions.slice(0, limit)
    },
    async getTransactionHistory(_memberId, { from, to }) {
      return transactions
        .filter(transaction => transaction.status === 'confirmed' && transaction.occurredAt >= from && transaction.occurredAt <= to)
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    },
    async getSummary() {
      return { earned: 2860, spent: 1540, expired: 40, balance: 1280 }
    },
    async getExpirySchedule() {
      return [
        { amount: 320, expiresAt: '2026-12-31' },
        { amount: 410, expiresAt: '2027-03-31' },
        { amount: 550, expiresAt: '2027-06-30' }
      ]
    }
  }
}
