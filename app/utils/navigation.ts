import type { NavItem } from '~/types/navigation'

export const mainNavItems: NavItem[] = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'ของรางวัล', to: '/rewards' },
  { label: 'คูปองของฉัน', to: '/coupons' },
  { label: 'Top Spender', to: '/top-spender' }
]

export const helpNavItems: NavItem[] = [
  { label: 'วิธีสะสมแต้ม', to: '/help/how-to-earn' },
  { label: 'เงื่อนไขการสะสมแต้ม', to: '/terms/points' },
  { label: 'นโยบายความเป็นส่วนตัว', to: '/privacy' },
  { label: 'ติดต่อเรา', to: '/contact' }
]
