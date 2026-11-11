import { createMockBannerRepository } from './banner.repository'
import { createMockCouponRepository } from './coupon.repository'
import { createMockLeaderboardRepository } from './leaderboard.repository'
import { createMockMemberRepository } from './member.repository'
import { createMockNotificationRepository } from './notification.repository'
import { createMockPetRepository } from './pet.repository'
import { createMockPointsRepository } from './points.repository'
import { createMockReferralRepository } from './referral.repository'
import { createMockRewardRepository } from './reward.repository'

const mockPetRepository = createMockPetRepository()
const mockNotificationRepository = createMockNotificationRepository()

// Single switch point for the data source: replace the mock factories with backend implementations when connecting
export function useRepositories() {
  return {
    member: createMockMemberRepository(),
    banner: createMockBannerRepository(),
    reward: createMockRewardRepository(),
    leaderboard: createMockLeaderboardRepository(),
    // Shared instances so the mocks remember writes (claimed coupon, read notifications) between calls
    pet: mockPetRepository,
    notification: mockNotificationRepository,
    referral: createMockReferralRepository(),
    points: createMockPointsRepository(),
    coupon: createMockCouponRepository()
  }
}
