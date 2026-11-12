export type PointTransactionKind = 'order' | 'coupon_redemption' | 'reward_redemption' | 'referral' | 'birthday_bonus' | 'expiry'
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

export interface PointsSummary {
  earned: number
  spent: number
  expired: number
  balance: number
}

export interface PointExpiryBatch {
  amount: number
  expiresAt: string
}

export interface DateRange {
  from: string
  to: string
}

export type PointHistoryFilter = 'all' | 'earned' | 'spent' | 'expired'
