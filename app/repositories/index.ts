import { createMockAddressRepository } from './address.repository'
import { createMockBannerRepository } from './banner.repository'
import { createMockCouponRepository } from './coupon.repository'
import { createMockHelpRepository } from './help.repository'
import { createMockLeaderboardRepository } from './leaderboard.repository'
import { createMockMemberRepository } from './member.repository'
import { createMockNotificationRepository } from './notification.repository'
import { createMockOrderRepository } from './order.repository'
import { createMockPetRepository } from './pet.repository'
import { createMockPointsRepository } from './points.repository'
import { createMockProductRepository } from './product.repository'
import { createMockReferralRepository } from './referral.repository'
import { createMockRewardRepository } from './reward.repository'

const mockMemberRepository = createMockMemberRepository()
const mockAddressRepository = createMockAddressRepository()
const mockPetRepository = createMockPetRepository()
const mockNotificationRepository = createMockNotificationRepository()

// Single switch point for the data source: replace the mock factories with backend implementations when connecting
export function useRepositories() {
  return {
    banner: createMockBannerRepository(),
    reward: createMockRewardRepository(),
    leaderboard: createMockLeaderboardRepository(),
    help: createMockHelpRepository(),
    // Shared instances so the mocks remember writes (profile edits, claimed coupon, read notifications) between calls
    member: mockMemberRepository,
    address: mockAddressRepository,
    pet: mockPetRepository,
    notification: mockNotificationRepository,
    referral: createMockReferralRepository(),
    points: createMockPointsRepository(),
    product: createMockProductRepository(),
    order: createMockOrderRepository(),
    coupon: createMockCouponRepository()
  }
}
