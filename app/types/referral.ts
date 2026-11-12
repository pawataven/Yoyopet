export interface ReferralSummary {
  referralCode: string
  rewardPointsPerReferral: number
  friendRewardPoints: number
  referredCount: number
  signedUpCount: number
  earnedPoints: number
}

export type ReferredFriendStatus = 'rewarded' | 'awaiting_first_order'

export interface ReferredFriend {
  id: string
  // Masked by the backend for privacy, e.g. "คุณป***"
  displayName: string
  signedUpAt: string
  status: ReferredFriendStatus
  pointsEarned: number | null
}
