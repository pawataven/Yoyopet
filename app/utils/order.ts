import type { MarketplaceId, OrderNumberGuide, OrderRejectionReason, SubmittedOrder, SubmittedOrderDetail, SubmittedOrderFilter, SubmittedOrderStatus } from '~/types/order'

// TODO: confirm each marketplace's menu path and sample screen with the YoYo team
export const orderNumberGuides: Record<MarketplaceId, OrderNumberGuide> = {
  'shopee': {
    marketplaceId: 'shopee',
    orderNumberPath: 'ฉัน › การซื้อของฉัน › เลือกคำสั่งซื้อ › หมายเลขคำสั่งซื้อ',
    orderNumberPlaceholder: 'เช่น 250918K3PQXXXX',
    sampleOrderNumber: '2610109XXXXXXX',
    sampleDetails: [{ label: 'ชำระผ่าน', value: 'QR พร้อมเพย์' }],
    sampleTimeline: [
      { label: 'เวลาที่สั่งซื้อ', value: '10-10-2026 18:05' },
      { label: 'เวลาที่ชำระเงิน', value: '10-10-2026 18:05' },
      { label: 'เวลาที่จัดส่งสินค้า', value: '12-10-2026 18:15' },
      { label: 'เวลาที่สำเร็จ', value: '16-10-2026 17:59' }
    ],
    steps: [
      'เปิดแอป Shopee › ฉัน › การซื้อของฉัน',
      'แตะคำสั่งซื้อสินค้า YoYo ที่ "สำเร็จแล้ว"',
      'เลื่อนลงล่างสุด คัดลอก "หมายเลขคำสั่งซื้อ"'
    ]
  },
  'tiktok-shop': {
    marketplaceId: 'tiktok-shop',
    orderNumberPath: 'โปรไฟล์ › คำสั่งซื้อของคุณ › เลือกคำสั่งซื้อ › หมายเลขคำสั่งซื้อ',
    orderNumberPlaceholder: 'เช่น 5762930114XXXXXXXX',
    sampleOrderNumber: '5762930XXXXXXXXXXX',
    sampleDetails: [{ label: 'วิธีการชำระเงิน', value: 'บัตรเครดิต/เดบิต' }],
    sampleTimeline: [
      { label: 'เวลาที่สั่งซื้อ', value: '10-10-2026 18:05' },
      { label: 'เวลาที่จัดส่ง', value: '11-10-2026 10:20' },
      { label: 'เวลาที่ได้รับสินค้า', value: '13-10-2026 14:32' }
    ],
    steps: [
      'เปิดแอป TikTok › โปรไฟล์ › คำสั่งซื้อของคุณ',
      'เลือกคำสั่งซื้อสินค้า YoYo ที่ได้รับแล้ว',
      'คัดลอก "หมายเลขคำสั่งซื้อ" มากรอก'
    ]
  },
  'lazada': {
    marketplaceId: 'lazada',
    orderNumberPath: 'บัญชี › คำสั่งซื้อของฉัน › เลือกคำสั่งซื้อ › หมายเลขคำสั่งซื้อ',
    orderNumberPlaceholder: 'เช่น 10293847XXXXXX',
    sampleOrderNumber: '10293847XXXXXXXX',
    sampleDetails: [{ label: 'ชำระผ่าน', value: 'เก็บเงินปลายทาง' }],
    sampleTimeline: [
      { label: 'สั่งซื้อเมื่อ', value: '10-10-2026 18:05' },
      { label: 'จัดส่งเมื่อ', value: '12-10-2026 09:40' },
      { label: 'ได้รับสินค้าเมื่อ', value: '14-10-2026 16:12' }
    ],
    steps: [
      'เปิดแอป Lazada › บัญชี › คำสั่งซื้อของฉัน',
      'เลือกคำสั่งซื้อสินค้า YoYo ที่ได้รับแล้ว',
      'คัดลอก "หมายเลขคำสั่งซื้อ" มากรอก'
    ]
  }
}

export const orderRejectionReasonLabels: Record<OrderRejectionReason, string> = {
  duplicate: 'เลขซ้ำ',
  cancelled: 'ยกเลิกคำสั่งซื้อ'
}

const pendingBadgeClass = 'bg-gold/25 text-pending'

export function getSubmittedOrderStatusBadge(order: SubmittedOrder) {
  switch (order.status) {
    case 'approved':
      return { label: 'อนุมัติแล้ว', class: 'bg-success/10 text-success' }
    case 'in-return-window':
      return { label: 'รอพ้นระยะคืนสินค้า', class: pendingBadgeClass }
    case 'verifying':
      return { label: 'กำลังตรวจสอบ', class: pendingBadgeClass }
    case 'rejected':
      return {
        label: order.rejectionReason ? `ไม่ผ่าน: ${orderRejectionReasonLabels[order.rejectionReason]}` : 'ไม่ผ่าน',
        class: 'bg-primary-soft text-primary-dark'
      }
  }
}

export type OrderTimelineStepState = 'done' | 'current' | 'upcoming' | 'failed'

export interface OrderTimelineStep {
  title: string
  caption: string | null
  state: OrderTimelineStepState
}

export function buildOrderTimeline(order: SubmittedOrderDetail, marketplaceName: string): OrderTimelineStep[] {
  const submittedStep: OrderTimelineStep = {
    title: 'ส่งเลขคำสั่งซื้อแล้ว',
    caption: formatThaiShortDateTime(order.submittedAt),
    state: 'done'
  }

  if (order.status === 'rejected') {
    return [submittedStep, {
      title: 'ไม่ผ่านการตรวจสอบ',
      caption: order.rejectionReason ? orderRejectionReasonLabels[order.rejectionReason] : null,
      state: 'failed'
    }]
  }

  const isVerifying = order.status === 'verifying'
  return [
    submittedStep,
    isVerifying
      ? { title: 'กำลังตรวจสอบคำสั่งซื้อ', caption: 'ภายใน 24 ชม.', state: 'current' }
      : { title: 'ตรวจสอบคำสั่งซื้อแล้ว', caption: `ยืนยันกับ ${marketplaceName} สำเร็จ`, state: 'done' },
    {
      title: 'รอพ้นระยะคืนสินค้า',
      caption: order.expectedCreditDate ? `ถึง ${formatThaiShortDate(order.expectedCreditDate)}` : null,
      state: order.status === 'approved' ? 'done' : order.status === 'in-return-window' ? 'current' : 'upcoming'
    },
    {
      title: 'แต้มเข้าบัญชี',
      caption: order.points ? `+${formatNumber(order.points)} แต้ม` : null,
      state: order.status === 'approved' ? 'done' : 'upcoming'
    }
  ]
}

export function submittedOrderFilterOf(status: SubmittedOrderStatus): Exclude<SubmittedOrderFilter, 'all'> {
  if (status === 'approved' || status === 'rejected') return status
  return 'pending'
}
