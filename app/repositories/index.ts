import { createMockBannerRepository } from './banner.repository'
import { createMockLeaderboardRepository } from './leaderboard.repository'
import { createMockMemberRepository } from './member.repository'
import { createMockPetRepository } from './pet.repository'
import { createMockReferralRepository } from './referral.repository'
import { createMockRewardRepository } from './reward.repository'

const mockPetRepository = createMockPetRepository()

// Single switch point for the data source: replace the mock factories with backend implementations when connecting
export function useRepositories() {
  return {
    member: createMockMemberRepository(),
    banner: createMockBannerRepository(),
    reward: createMockRewardRepository(),
    leaderboard: createMockLeaderboardRepository(),
    // Shared instance so the mock remembers a claimed birthday coupon between calls
    pet: mockPetRepository,
    referral: createMockReferralRepository()
  }
}
