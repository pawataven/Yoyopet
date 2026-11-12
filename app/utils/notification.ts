import type { NotificationCategory, NotificationKind } from '~/types/notification'

export type NotificationFilter = 'all' | NotificationCategory

export const notificationFilters: { value: NotificationFilter, label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'points', label: 'แต้ม' },
  { value: 'redemption', label: 'การแลก' },
  { value: 'promotion', label: 'โปรโมชัน' }
]

const positiveTone = 'bg-success/10 text-success'
const attentionTone = 'bg-primary-soft text-primary-dark'
const reminderTone = 'bg-gold/25 text-pending'
const neutralTone = 'bg-border text-muted'

export const notificationAppearanceByKind: Record<NotificationKind, { icon: string, iconClass: string }> = {
  points_earned: { icon: 'lucide:star', iconClass: positiveTone },
  order_approved: { icon: 'lucide:check', iconClass: positiveTone },
  order_rejected: { icon: 'lucide:x', iconClass: neutralTone },
  points_expiring: { icon: 'lucide:clock', iconClass: reminderTone },
  tier_progress: { icon: 'lucide:award', iconClass: attentionTone },
  reward_shipping: { icon: 'lucide:truck', iconClass: attentionTone },
  coupon_ready: { icon: 'lucide:ticket', iconClass: attentionTone },
  coupon_expiring: { icon: 'lucide:clock', iconClass: reminderTone },
  new_reward: { icon: 'lucide:gift', iconClass: attentionTone },
  pet_birthday: { icon: 'lucide:cake', iconClass: attentionTone },
  top_spender_result: { icon: 'lucide:trophy', iconClass: reminderTone }
}

const RECENT_HOURS_SHOWN_AS_RELATIVE = 3

const clockTimeFormatter = new Intl.DateTimeFormat('th-TH', { hour: 'numeric', minute: '2-digit' })
const dayMonthFormatter = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short' })

export function isSameLocalDay(first: Date, second: Date) {
  return first.toDateString() === second.toDateString()
}

// Fresh items read as "x นาทีที่แล้ว"; older ones today show the clock time, then เมื่อวาน, then the date
export function formatNotificationTime(isoDate: string, now = new Date()) {
  const createdAt = new Date(isoDate)
  const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / 60000))
  if (elapsedMinutes < 1) return 'เมื่อสักครู่'
  if (elapsedMinutes < 60) return `${elapsedMinutes} นาทีที่แล้ว`
  if (elapsedMinutes < RECENT_HOURS_SHOWN_AS_RELATIVE * 60) return `${Math.floor(elapsedMinutes / 60)} ชม.ที่แล้ว`
  if (isSameLocalDay(createdAt, now)) return clockTimeFormatter.format(createdAt)

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameLocalDay(createdAt, yesterday)) return 'เมื่อวาน'
  return dayMonthFormatter.format(createdAt)
}
