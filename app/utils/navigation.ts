import type { MobileTabItem, NavItem } from '~/types/navigation'

export const mainNavItems: NavItem[] = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'ของรางวัล', to: '/rewards' },
  { label: 'คูปองของฉัน', to: '/coupons' },
  { label: 'Top Spender', to: '/top-spender' }
]

export const mobileTabItems: MobileTabItem[] = [
  { label: 'หน้าแรก', to: '/', icon: 'lucide:house' },
  { label: 'ของรางวัล', to: '/rewards', icon: 'lucide:gift' },
  { label: 'รับแต้ม', to: '/orders/submit', icon: 'lucide:receipt-text', activePrefix: '/orders/', isPrimaryAction: true },
  { label: 'คูปอง', to: '/coupons', icon: 'lucide:ticket' },
  { label: 'Top Spender', to: '/top-spender', icon: 'lucide:trophy' }
]

export const helpNavItems: NavItem[] = [
  { label: 'วิธีสะสมแต้ม', to: '/help/how-to-earn' },
  { label: 'เงื่อนไขการสะสมแต้ม', to: '/terms/points' },
  { label: 'นโยบายความเป็นส่วนตัว', to: '/privacy' },
  { label: 'ติดต่อเรา', to: '/help/how-to-earn#contact-support' }
]

export function isNavPathActive(currentPath: string, to: string) {
  return to === '/' ? currentPath === '/' : currentPath.startsWith(to)
}
