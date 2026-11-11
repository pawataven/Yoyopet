export type PointTransactionKind = 'order' | 'redemption' | 'referral'
export type PointTransactionStatus = 'confirmed' | 'pending'

export interface PointTransaction {
  id: string
  kind: PointTransactionKind
  status: PointTransactionStatus
  title: string
  reference: string | null
  occurredAt: string
  points: number
}
