export interface MemberSummary {
  id: string
  displayName: string
  avatarUrl: string | null
  points: number
  tier: string
  memberCode: string
  unreadNotificationCount: number
}

export interface TierProgress {
  currentTier: string
  nextTier: string | null
  pointsToNextTier: number
  progressPercent: number
}

export interface TierLevel {
  name: string
  minPoints: number
  benefits: string[]
}

export interface ExpiringPoints {
  amount: number
  expiresAt: string
}

export interface PendingOrdersSummary {
  count: number
  points: number
}

export interface MemberDashboard {
  tierProgress: TierProgress
  expiringPoints: ExpiringPoints | null
  pendingOrders: PendingOrdersSummary
  isLineConnected: boolean
}
