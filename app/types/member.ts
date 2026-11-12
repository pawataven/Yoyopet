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
  perkHighlights: string[]
}

export interface MemberTierStatus extends TierProgress {
  qualifyingSpendBaht: number
  qualifyingPoints: number
  nextReviewDate: string
}

// true renders a check mark, false renders a dash
export type TierBenefitValue = string | boolean

export interface TierBenefitComparisonRow {
  label: string
  valueByTier: Record<string, TierBenefitValue>
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
  isLineOfficialAccountFriend: boolean
}

export type Gender = 'female' | 'male' | 'unspecified'

export type PetOwnership = 'dog' | 'cat' | 'both' | 'other'

export interface OnboardingStatus {
  isRequired: boolean
  welcomeBonusPoints: number
  hasAcceptedPrivacyPolicy: boolean
}

export interface MemberOnboarding {
  firstName: string
  lastName: string
  birthDate: string | null
  email: string | null
  referralCode: string | null
  acceptedTerms: boolean
  marketingOptIn: boolean
}

export interface MemberProfile {
  id: string
  firstName: string
  lastName: string
  phone: string
  isPhoneVerified: boolean
  email: string | null
  birthDate: string | null
  gender: Gender | null
  petOwnership: PetOwnership | null
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

export type NotificationChannel = 'line' | 'web'

export type NotificationTopic =
  | 'pointsAndOrders'
  | 'redemptionAndShipping'
  | 'expiry'
  | 'tierAndTopSpender'
  | 'promotions'

export type NotificationChannelSettings = Record<NotificationChannel, boolean>

// Account and security messages are always sent, so they have no topic here
export interface NotificationPreferences {
  topics: Record<NotificationTopic, NotificationChannelSettings>
}

export type ConsentPurpose = 'marketing' | 'petData'

export interface ConsentStatus {
  granted: boolean
  // When the member last gave or withdrew it; null if they never answered
  updatedAt: string | null
}

export interface TermsAcceptance {
  version: string
  acceptedAt: string
}

export interface MemberConsents {
  terms: TermsAcceptance | null
  // Promotions are only sent when this is given and the promotions topic is switched on
  marketing: ConsentStatus
  petData: ConsentStatus
}

export interface ConsentHistoryEntry {
  id: string
  purpose: ConsentPurpose
  granted: boolean
  recordedAt: string
}

export interface PrivacyRequests {
  dataExportRequestedAt: string | null
  accountDeletionRequestedAt: string | null
}
