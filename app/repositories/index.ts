import { createMockBannerRepository } from './banner.repository'
import { createMockLeaderboardRepository } from './leaderboard.repository'
import { createMockMemberRepository } from './member.repository'
import { createMockRewardRepository } from './reward.repository'

// Single switch point for the data source: replace the mock factories with backend implementations when connecting
export function useRepositories() {
  return {
    member: createMockMemberRepository(),
    banner: createMockBannerRepository(),
    reward: createMockRewardRepository(),
    leaderboard: createMockLeaderboardRepository()
  }
}
