export type NotificationCategory = 'points' | 'redemption' | 'promotion'

export type NotificationKind =
  | 'points_earned'
  | 'order_approved'
  | 'order_rejected'
  | 'points_expiring'
  | 'tier_progress'
  | 'reward_shipping'
  | 'coupon_ready'
  | 'coupon_expiring'
  | 'new_reward'
  | 'pet_birthday'
  | 'top_spender_result'

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
