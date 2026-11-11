export type NotificationCategory = 'points' | 'coupon' | 'shipping'

export type NotificationKind =
  | 'points_earned'
  | 'order_rejected'
  | 'points_expiring'
  | 'coupon_ready'
  | 'reward_shipping'
  | 'tier_progress'

export interface MemberNotification {
  id: string
  kind: NotificationKind
  category: NotificationCategory
  title: string
  body: string
  createdAt: string
  isRead: boolean
  linkUrl: string | null
}
