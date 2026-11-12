import type { TopSpenderEntry, TopSpenderLeaderboard, TopSpenderMonthWinners, TopSpenderPrize } from '~/types/leaderboard'

const REWARDED_RANK_COUNT = 3

export interface LeaderboardRepository {
  // Newest first; the first month is the one still running
  getLeaderboardMonths(): Promise<string[]>
  // month omitted means the current month
  getMonthlyTopSpenders(memberId: string | null, month?: string): Promise<TopSpenderLeaderboard>
  getPastWinners(limit: number): Promise<TopSpenderMonthWinners[]>
}

interface MockLeaderboardMonth {
  month: string
  periodEnd: string
  winners: TopSpenderEntry[]
  runnerUpSpendFactor: number
  myStanding: TopSpenderLeaderboard['myStanding']
}

export function createMockLeaderboardRepository(): LeaderboardRepository {
  const prizes: TopSpenderPrize[] = [
    { rank: 1, name: 'ทรายเต้าหู้ YoYo Tofu 4 ถุง', imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', bonusCouponBaht: 500 },
    { rank: 2, name: 'น้ำหอม Berry Cream 60ml', imageUrl: '/rewards/berry-cream-spray-60ml.jpg', bonusCouponBaht: 300 },
    { rank: 3, name: 'ทิชชู่เปียก Pet Wipes 80 แผ่น 3 แพ็ก', imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', bonusCouponBaht: 200 }
  ]

  const runnersUp: TopSpenderEntry[] = [
    { rank: 4, maskedName: 'คุณส***', initial: 'ส', tier: 'Best Friend', totalSpentBaht: 9870 },
    { rank: 5, maskedName: 'คุณอ***', initial: 'อ', tier: 'Buddy', totalSpentBaht: 8140 },
    { rank: 6, maskedName: 'คุณจ***', initial: 'จ', tier: 'Family', totalSpentBaht: 7920 },
    { rank: 7, maskedName: 'คุณด***', initial: 'ด', tier: 'Best Friend', totalSpentBaht: 6550 },
    { rank: 8, maskedName: 'คุณบ***', initial: 'บ', tier: 'Buddy', totalSpentBaht: 5410 },
    { rank: 9, maskedName: 'คุณร***', initial: 'ร', tier: 'Buddy', totalSpentBaht: 4890 },
    { rank: 10, maskedName: 'คุณป***', initial: 'ป', tier: 'Buddy', totalSpentBaht: 4480 }
  ]

  const leaderboardMonths: MockLeaderboardMonth[] = [
    {
      month: '2026-11-01',
      periodEnd: '2026-11-30',
      winners: [
        { rank: 1, maskedName: 'คุณพ***', initial: 'พ', tier: 'Family', totalSpentBaht: 18920 },
        { rank: 2, maskedName: 'คุณน***', initial: 'น', tier: 'Best Friend', totalSpentBaht: 15300 },
        { rank: 3, maskedName: 'คุณก***', initial: 'ก', tier: 'Best Friend', totalSpentBaht: 12450 }
      ],
      runnerUpSpendFactor: 1,
      myStanding: { rank: 18, totalSpentBaht: 3280, amountToTargetBaht: 1200, targetRank: 10 }
    },
    {
      month: '2026-10-01',
      periodEnd: '2026-10-31',
      winners: [
        { rank: 1, maskedName: 'คุณน***', initial: 'น', tier: 'Best Friend', totalSpentBaht: 21300 },
        { rank: 2, maskedName: 'คุณพ***', initial: 'พ', tier: 'Family', totalSpentBaht: 17650 },
        { rank: 3, maskedName: 'คุณจ***', initial: 'จ', tier: 'Family', totalSpentBaht: 13020 }
      ],
      runnerUpSpendFactor: 1.1,
      myStanding: { rank: 24, totalSpentBaht: 2140, amountToTargetBaht: 3290, targetRank: 10 }
    },
    {
      month: '2026-09-01',
      periodEnd: '2026-09-30',
      winners: [
        { rank: 1, maskedName: 'คุณพ***', initial: 'พ', tier: 'Family', totalSpentBaht: 19880 },
        { rank: 2, maskedName: 'คุณก***', initial: 'ก', tier: 'Best Friend', totalSpentBaht: 14200 },
        { rank: 3, maskedName: 'คุณส***', initial: 'ส', tier: 'Best Friend', totalSpentBaht: 11900 }
      ],
      runnerUpSpendFactor: 0.95,
      myStanding: { rank: 31, totalSpentBaht: 1260, amountToTargetBaht: 3000, targetRank: 10 }
    },
    {
      month: '2026-08-01',
      periodEnd: '2026-08-31',
      winners: [
        { rank: 1, maskedName: 'คุณส***', initial: 'ส', tier: 'Best Friend', totalSpentBaht: 16540 },
        { rank: 2, maskedName: 'คุณร***', initial: 'ร', tier: 'Buddy', totalSpentBaht: 13310 },
        { rank: 3, maskedName: 'คุณบ***', initial: 'บ', tier: 'Buddy', totalSpentBaht: 10870 }
      ],
      runnerUpSpendFactor: 0.9,
      myStanding: null
    }
  ]

  function toLeaderboard(leaderboardMonth: MockLeaderboardMonth, memberId: string | null, isFinal: boolean): TopSpenderLeaderboard {
    const monthRunnersUp = runnersUp.map(entry => ({
      ...entry,
      totalSpentBaht: Math.round((entry.totalSpentBaht * leaderboardMonth.runnerUpSpendFactor) / 10) * 10
    }))
    return {
      month: leaderboardMonth.month,
      periodEnd: leaderboardMonth.periodEnd,
      isFinal,
      rewardedRankCount: REWARDED_RANK_COUNT,
      entries: [...leaderboardMonth.winners, ...monthRunnersUp],
      prizes,
      myStanding: memberId ? leaderboardMonth.myStanding : null
    }
  }

  return {
    async getLeaderboardMonths() {
      return leaderboardMonths.map(leaderboardMonth => leaderboardMonth.month)
    },
    async getMonthlyTopSpenders(memberId, month) {
      const monthIndex = Math.max(0, leaderboardMonths.findIndex(leaderboardMonth => leaderboardMonth.month === month))
      return toLeaderboard(leaderboardMonths[monthIndex]!, memberId, monthIndex > 0)
    },
    async getPastWinners(limit) {
      return leaderboardMonths
        .slice(1, limit + 1)
        .map(leaderboardMonth => ({ month: leaderboardMonth.month, winners: leaderboardMonth.winners }))
    }
  }
}
