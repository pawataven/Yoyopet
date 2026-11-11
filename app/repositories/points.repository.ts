import type { PointTransaction } from '~/types/points'

export interface PointsRepository {
  getRecentTransactions(memberId: string, limit: number): Promise<PointTransaction[]>
}

export function createMockPointsRepository(): PointsRepository {
  const transactions: PointTransaction[] = [
    { id: 'tx-1', kind: 'order', status: 'confirmed', title: 'สั่งซื้อผ่าน Shopee', reference: '250918K3PQ', occurredAt: '2026-11-08', points: 12 },
    { id: 'tx-2', kind: 'order', status: 'pending', title: 'รอยืนยัน · TikTok Shop', reference: '576293011', occurredAt: '2026-11-09', points: 15 },
    { id: 'tx-3', kind: 'redemption', status: 'confirmed', title: 'แลกคูปองส่วนลด 50 บาท', reference: null, occurredAt: '2026-11-05', points: -300 },
    { id: 'tx-4', kind: 'referral', status: 'confirmed', title: 'ชวนเพื่อนสมัครสมาชิก', reference: null, occurredAt: '2026-11-02', points: 50 }
  ]

  return {
    async getRecentTransactions(_memberId, limit) {
      return transactions.slice(0, limit)
    }
  }
}
