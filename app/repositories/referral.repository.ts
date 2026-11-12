import type { ReferralSummary, ReferredFriend } from '~/types/referral'

export interface ReferralRepository {
  getSummary(memberId: string): Promise<ReferralSummary | null>
  getReferredFriends(memberId: string): Promise<ReferredFriend[]>
}

export function createMockReferralRepository(): ReferralRepository {
  return {
    async getSummary() {
      return {
        referralCode: 'YOYO-MIND25',
        rewardPointsPerReferral: 50,
        friendRewardPoints: 50,
        referredCount: 3,
        signedUpCount: 3,
        earnedPoints: 150
      }
    },

    async getReferredFriends() {
      return [
        { id: 'ref-1', displayName: 'คุณป***', signedUpAt: '2026-11-02', status: 'rewarded', pointsEarned: 50 },
        { id: 'ref-2', displayName: 'คุณจ***', signedUpAt: '2026-10-28', status: 'rewarded', pointsEarned: 50 },
        { id: 'ref-3', displayName: 'คุณน***', signedUpAt: '2026-10-20', status: 'rewarded', pointsEarned: 50 },
        { id: 'ref-4', displayName: 'คุณว***', signedUpAt: '2026-10-09', status: 'awaiting_first_order', pointsEarned: null }
      ]
    }
  }
}
