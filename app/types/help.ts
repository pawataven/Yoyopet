export interface FaqItem {
  id: string
  question: string
  summary: string
  answer: string
}

export interface TierPointsMultiplier {
  tier: string
  multiplier: number
}

export interface PointsEarningRule {
  bahtPerPoint: number
  tierMultipliers: TierPointsMultiplier[]
}
