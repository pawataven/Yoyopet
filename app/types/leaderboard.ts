export interface TopSpenderEntry {
  rank: number
  maskedName: string
  initial: string
  tier: string
  totalSpentBaht: number
}

export interface MyTopSpenderStanding {
  rank: number
  totalSpentBaht: number
  amountToTargetBaht: number
  targetRank: number
}

export interface TopSpenderPrize {
  rank: number
  name: string
  imageUrl: string
  bonusCouponBaht: number
}

export interface TopSpenderLeaderboard {
  // First day of the month, e.g. 2026-11-01
  month: string
  periodEnd: string
  // Past months are closed and their ranking no longer changes
  isFinal: boolean
  rewardedRankCount: number
  entries: TopSpenderEntry[]
  prizes: TopSpenderPrize[]
  myStanding: MyTopSpenderStanding | null
}

export interface TopSpenderMonthWinners {
  month: string
  winners: TopSpenderEntry[]
}
