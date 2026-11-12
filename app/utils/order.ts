import type { MarketplaceId, OrderNumberGuide } from '~/types/order'

// TODO: confirm each marketplace's menu path and sample screen with the YoYo team
export const orderNumberGuides: Record<MarketplaceId, OrderNumberGuide> = {
  'shopee': {
    marketplaceId: 'shopee',
    orderNumberPath: 'ฉัน › การซื้อของฉัน › เลือกคำสั่งซื้อ › หมายเลขคำสั่งซื้อ',
    orderNumberPlaceholder: 'เช่น 250918K3PQXXXX',
    sampleOrderNumber: '2610109JV3JJQD',
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
    sampleOrderNumber: '576293011482736451',
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
    sampleOrderNumber: '1029384756123456',
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
