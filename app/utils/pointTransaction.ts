import type { PointHistoryFilter, PointTransaction } from '~/types/points'

export interface PointTransactionAppearance {
  // null renders the custom order-entry icon, which has no Lucide equivalent
  icon: string | null
  iconClass: string
  amountClass: string
}

const earnedAppearance = { iconClass: 'bg-success/10 text-success', amountClass: 'text-success' }
const spentAppearance = { iconClass: 'bg-primary-soft text-primary-dark', amountClass: 'text-primary-dark' }

export function getPointTransactionAppearance(transaction: PointTransaction): PointTransactionAppearance {
  if (transaction.status === 'pending') {
    return { icon: 'lucide:clock', iconClass: 'bg-gold/25 text-pending', amountClass: 'text-pending' }
  }
  switch (transaction.kind) {
    case 'coupon_redemption':
      return { icon: 'lucide:ticket', ...spentAppearance }
    case 'reward_redemption':
      return { icon: 'lucide:gift', ...spentAppearance }
    case 'referral':
      return { icon: 'lucide:users', ...earnedAppearance }
    case 'birthday_bonus':
      return { icon: 'lucide:cake', ...earnedAppearance }
    case 'expiry':
      return { icon: 'lucide:clock', iconClass: 'bg-muted/10 text-muted', amountClass: 'text-muted' }
    case 'order':
      return { icon: null, ...earnedAppearance }
  }
}

export function formatSignedPoints(points: number) {
  return points < 0 ? `−${formatNumber(Math.abs(points))}` : `+${formatNumber(points)}`
}

export function matchesPointHistoryFilter(transaction: PointTransaction, filter: PointHistoryFilter) {
  switch (filter) {
    case 'all':
      return true
    case 'expired':
      return transaction.kind === 'expiry'
    case 'earned':
      return transaction.kind !== 'expiry' && transaction.points > 0
    case 'spent':
      return transaction.kind !== 'expiry' && transaction.points < 0
  }
}
