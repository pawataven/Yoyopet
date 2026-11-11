export interface TopSpenderEntry {
  rank: number
  maskedName: string
  initial: string
  totalSpentBaht: number
}

export interface MyTopSpenderStanding {
  rank: number
  totalSpentBaht: number
  amountToTargetBaht: number
  targetRank: number
}

export interface TopSpenderLeaderboard {
  periodEnd: string
  rewardedRankCount: number
  entries: TopSpenderEntry[]
  myStanding: MyTopSpenderStanding | null
}
