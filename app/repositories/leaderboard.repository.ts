import type { TopSpenderLeaderboard } from '~/types/leaderboard'

export interface LeaderboardRepository {
  getMonthlyTopSpenders(memberId: string | null): Promise<TopSpenderLeaderboard>
}

export function createMockLeaderboardRepository(): LeaderboardRepository {
  return {
    async getMonthlyTopSpenders(memberId) {
      return {
        periodEnd: '2026-11-30',
        rewardedRankCount: 3,
        entries: [
          { rank: 1, maskedName: 'คุณพ***', initial: 'พ', totalSpentBaht: 18920 },
          { rank: 2, maskedName: 'คุณน***', initial: 'น', totalSpentBaht: 15300 },
          { rank: 3, maskedName: 'คุณก***', initial: 'ก', totalSpentBaht: 12450 },
          { rank: 4, maskedName: 'คุณส***', initial: 'ส', totalSpentBaht: 9870 },
          { rank: 5, maskedName: 'คุณอ***', initial: 'อ', totalSpentBaht: 8140 }
        ],
        myStanding: memberId
          ? { rank: 18, totalSpentBaht: 3280, amountToTargetBaht: 1200, targetRank: 10 }
          : null
      }
    }
  }
}
