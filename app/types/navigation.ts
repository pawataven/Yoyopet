export interface NavItem {
  label: string
  to: string
}

export interface MobileTabItem extends NavItem {
  icon: string
  // Highlights the tab for every route under this prefix instead of only `to`
  activePrefix?: string
  isPrimaryAction?: boolean
}
