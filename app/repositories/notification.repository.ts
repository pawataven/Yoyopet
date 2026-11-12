import type { MemberNotification } from '~/types/notification'

export interface NotificationRepository {
  getNotifications(memberId: string): Promise<MemberNotification[]>
  markAsRead(memberId: string, notificationIds: string[]): Promise<void>
  markAllAsRead(memberId: string): Promise<void>
}

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR_MS).toISOString()
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString()
}

export function createMockNotificationRepository(): NotificationRepository {
  let notifications: MemberNotification[] = [
    { id: 'noti-1', kind: 'points_earned', category: 'points', title: 'แต้มเข้าแล้ว +12 แต้ม', body: 'คำสั่งซื้อ Shopee #250918K3PQ', createdAt: hoursAgo(2), isRead: false, linkUrl: '/points/history' },
    { id: 'noti-2', kind: 'order_rejected', category: 'points', title: 'คำสั่งซื้อไม่ผ่านการตรวจสอบ', body: 'เลข #250901AB12 ถูกใช้สะสมแต้มแล้ว', createdAt: daysAgo(1), isRead: false, linkUrl: '/orders/history' },
    { id: 'noti-3', kind: 'points_expiring', category: 'points', title: '320 แต้มจะหมดอายุ', body: 'ใช้ก่อน 31 ธ.ค. 2026', createdAt: daysAgo(2), isRead: true, linkUrl: '/rewards' },
    { id: 'noti-4', kind: 'coupon_ready', category: 'coupon', title: 'คูปองวันเกิดน้องมะลิพร้อมใช้', body: 'ส่วนลด 10% ใช้ได้ถึง 15 พ.ย.', createdAt: daysAgo(3), isRead: true, linkUrl: '/coupons' },
    { id: 'noti-5', kind: 'reward_shipping', category: 'shipping', title: 'ของรางวัลกำลังจัดส่ง', body: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', createdAt: daysAgo(5), isRead: true, linkUrl: '/rewards/history' },
    { id: 'noti-6', kind: 'tier_progress', category: 'points', title: 'อีก 720 แต้มเลื่อนเป็น Best Friend', body: 'ดูสิทธิ์ของระดับถัดไป', createdAt: daysAgo(7), isRead: true, linkUrl: '/tiers' }
  ]

  return {
    async getNotifications() {
      return notifications
    },

    async markAsRead(_memberId, notificationIds) {
      notifications = notifications.map(notification =>
        notificationIds.includes(notification.id) ? { ...notification, isRead: true } : notification
      )
    },

    async markAllAsRead() {
      notifications = notifications.map(notification => ({ ...notification, isRead: true }))
    }
  }
}
