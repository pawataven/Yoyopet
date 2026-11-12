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

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString()
}

// Before 9:00 the mock would otherwise date a "today" item in the future
function todayAtOrEarlier(hour: number) {
  const scheduled = new Date()
  scheduled.setHours(hour, 0, 0, 0)
  return new Date(Math.min(scheduled.getTime(), Date.now())).toISOString()
}

export function createMockNotificationRepository(): NotificationRepository {
  let notifications: MemberNotification[] = [
    { id: 'noti-1', kind: 'points_earned', category: 'points', title: 'แต้มเข้าแล้ว +12 แต้ม', body: 'Shopee #250918K3PQ', createdAt: minutesAgo(10), isRead: false, linkUrl: '/points/history' },
    { id: 'noti-2', kind: 'reward_shipping', category: 'redemption', title: 'ทรายเต้าหู้ของคุณกำลังจัดส่ง', body: 'Flash Express', createdAt: hoursAgo(2), isRead: false, linkUrl: '/rewards/history' },
    { id: 'noti-3', kind: 'coupon_expiring', category: 'promotion', title: 'คูปองวันเกิดใกล้หมดอายุ', body: 'BDAY-MALI10 เหลือ 5 วัน', createdAt: todayAtOrEarlier(9), isRead: false, linkUrl: '/coupons' },
    { id: 'noti-4', kind: 'order_approved', category: 'points', title: 'อนุมัติคำสั่งซื้อ TikTok Shop', body: 'รอพ้นระยะคืนสินค้า', createdAt: daysAgo(1), isRead: true, linkUrl: '/orders/history' },
    { id: 'noti-5', kind: 'new_reward', category: 'promotion', title: 'ของรางวัลใหม่! ถุงมือสปา', body: 'แลกได้ตั้งแต่ 450 แต้ม', createdAt: daysAgo(5), isRead: true, linkUrl: '/rewards' },
    { id: 'noti-6', kind: 'pet_birthday', category: 'promotion', title: 'สุขสันต์วันเกิดน้องมะลิ', body: 'รับคูปองลด 10%', createdAt: daysAgo(12), isRead: true, linkUrl: '/coupons' },
    { id: 'noti-7', kind: 'top_spender_result', category: 'promotion', title: 'ประกาศผล Top Spender ต.ค.', body: 'คุณได้อันดับ 2', createdAt: daysAgo(12), isRead: true, linkUrl: '/top-spender' },
    { id: 'noti-8', kind: 'order_rejected', category: 'points', title: 'คำสั่งซื้อไม่ผ่านการตรวจสอบ', body: 'เลขซ้ำ 250901AB12', createdAt: daysAgo(14), isRead: true, linkUrl: '/orders/history' }
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
