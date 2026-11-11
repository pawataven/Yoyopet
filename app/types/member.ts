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

export type Gender = 'female' | 'male' | 'unspecified'

export interface MemberProfile {
  id: string
  firstName: string
  lastName: string
  phone: string
  isPhoneVerified: boolean
  email: string | null
  birthDate: string | null
  gender: Gender | null
  avatarUrl: string | null
  memberCode: string
  tier: string
  joinedAt: string
  isLineConnected: boolean
}

export interface MemberProfileUpdate {
  firstName: string
  lastName: string
  email: string | null
  birthDate: string | null
  gender: Gender | null
}

export interface NotificationPreferences {
  orderAndPointsUpdates: boolean
  pointsExpiry: boolean
  promotions: boolean
  petDataConsent: boolean
}
