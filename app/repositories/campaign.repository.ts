import type { Campaign } from '~/types/campaign'

export interface CampaignRepository {
  getCampaign(campaignId: string): Promise<Campaign | null>
}

export function createMockCampaignRepository(): CampaignRepository {
  // TODO: replace imageUrl null with real product photos and shopUrl with product pages once available
  const campaigns: Campaign[] = [
    {
      id: 'yoyo-for-your-pet-2026-11',
      title: 'YoYo For your Pet',
      tagline: 'แคมเปญเดือนพฤศจิกายน',
      bannerImageUrl: '/banners/yoyo-for-your-pet.jpg',
      startsOn: '2026-11-01',
      endsOn: '2026-11-30',
      highlights: [
        'รับแต้ม x2 เมื่อซื้อทรายเต้าหู้ YoYo Tofu ทุกช่องทาง',
        'ซื้อครบ 999 บาท รับคูปองส่วนลด 50 บาท',
        'สมาชิกใหม่รับ 50 แต้มต้อนรับ',
        'กรอกเลขคำสั่งซื้อภายใน 7 ธ.ค. 2026'
      ],
      products: [
        { id: 'product-tofu-litter-7l', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', badge: 'แต้ม x2', shopUrl: '/#shop' },
        { id: 'product-tofu-litter-corn-7l', name: 'ทรายเต้าหู้ กลิ่นนมข้าวโพด 7 ลิตร', imageUrl: null, badge: 'แต้ม x2', shopUrl: '/#shop' },
        { id: 'product-litter-deodorizer-lavender', name: 'ผงดับกลิ่นทรายแมว Lavender', imageUrl: null, badge: null, shopUrl: '/#shop' },
        { id: 'product-pet-wipes-80', name: 'ทิชชู่เปียก Pet Wipes 80 แผ่น', imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', badge: null, shopUrl: '/#shop' }
      ]
    }
  ]

  return {
    async getCampaign(campaignId) {
      return campaigns.find(campaign => campaign.id === campaignId) ?? null
    }
  }
}
