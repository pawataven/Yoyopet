import type { RewardBadge, RewardGroup, RewardRedemptionStatus } from '~/types/reward'

export const rewardGroupLabels: Record<RewardGroup, string> = {
  coupon: 'คูปองส่วนลด',
  cat_litter: 'ทรายแมว',
  cleaning: 'ทำความสะอาด',
  grooming: 'ดูแลขนและกลิ่น',
  cat_toy: 'ของเล่นแมว'
}

export const rewardGroupOrder: RewardGroup[] = ['coupon', 'cat_litter', 'cleaning', 'grooming', 'cat_toy']

export const rewardBadgeAppearance: Record<RewardBadge, { label: string, class: string }> = {
  new: { label: 'ใหม่', class: 'bg-ink text-white' },
  best_seller: { label: 'ขายดี', class: 'bg-primary text-white' }
}

export const rewardRedemptionStatusAppearance: Record<RewardRedemptionStatus, { label: string, class: string }> = {
  preparing: { label: 'กำลังเตรียมของ', class: 'bg-gold/25 text-pending' },
  shipping: { label: 'กำลังจัดส่ง', class: 'bg-gold/25 text-pending' },
  delivered: { label: 'ได้รับแล้ว', class: 'bg-success/10 text-success' },
  ready_to_use: { label: 'พร้อมใช้', class: 'bg-primary-soft text-primary-dark' },
  used: { label: 'ใช้แล้ว', class: 'bg-success/10 text-success' }
}
