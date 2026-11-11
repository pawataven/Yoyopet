import type { ReferralSummary } from '~/types/referral'

export interface ReferralRepository {
  getSummary(memberId: string): Promise<ReferralSummary | null>
}

export function createMockReferralRepository(): ReferralRepository {
  return {
    async getSummary() {
      return {
        referralCode: 'YOYO-MIND25',
        rewardPointsPerReferral: 50,
        friendRewardPoints: 50,
        referredCount: 3
      }
    }
  }
}
