import type { Reward, RewardRedemption } from '~/types/reward'

export interface RewardRepository {
  getRecommendedRewards(): Promise<Reward[]>
  getRewards(): Promise<Reward[]>
  getRecentRedemptions(memberId: string, limit: number): Promise<RewardRedemption[]>
}

// TODO: imageUrl null items still need product photos
const MOCK_REWARDS: Reward[] = [
  { id: 'coupon-50-baht', name: 'คูปองส่วนลด 50 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 300, imageUrl: null, couponValueBaht: 50 },
  { id: 'matatabi-stick', name: 'ไม้มาทาทาบิ ขัดฟันแมว', category: 'product', group: 'cat_toy', badge: null, pointsCost: 400, imageUrl: null, couponValueBaht: null },
  { id: 'double-ended-cotton-swab-200', name: 'สำลีก้านปลายคู่ 200 ก้าน', category: 'product', group: 'cleaning', badge: null, pointsCost: 450, imageUrl: null, couponValueBaht: null },
  { id: 'pet-spa-gloves', name: 'ถุงมือสปา Pet SPA Gloves', category: 'product', group: 'cleaning', badge: 'new', pointsCost: 450, imageUrl: null, couponValueBaht: null },
  { id: 'coupon-100-baht', name: 'คูปองส่วนลด 100 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 550, imageUrl: null, couponValueBaht: 100 },
  { id: 'yoyo-pet-wipes-80', name: 'ทิชชู่เปียก Pet Wipes 80 แผ่น', category: 'product', group: 'cleaning', badge: 'best_seller', pointsCost: 600, imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', couponValueBaht: null },
  { id: 'feather-teaser-wand', name: 'ไม้ตกแมว ขนนก', category: 'product', group: 'cat_toy', badge: null, pointsCost: 350, imageUrl: null, couponValueBaht: null },
  { id: 'eye-clean-wipe', name: 'แผ่นเช็ดคราบน้ำตา Eye Clean', category: 'product', group: 'cleaning', badge: null, pointsCost: 500, imageUrl: null, couponValueBaht: null },
  { id: 'pet-grooming-brush', name: 'แปรงหวีขนสัตว์เลี้ยง', category: 'product', group: 'grooming', badge: null, pointsCost: 650, imageUrl: null, couponValueBaht: null },
  { id: 'litter-deodorizer-lavender', name: 'ผงดับกลิ่นทรายแมว Lavender', category: 'product', group: 'grooming', badge: null, pointsCost: 700, imageUrl: null, couponValueBaht: null },
  { id: 'yoyo-tofu-litter-7l', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', category: 'product', group: 'cat_litter', badge: null, pointsCost: 900, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', couponValueBaht: null },
  { id: 'berry-cream-spray-60ml', name: 'สเปรย์น้ำหอม Berry Cream 60ml', category: 'product', group: 'grooming', badge: null, pointsCost: 1500, imageUrl: '/rewards/berry-cream-spray-60ml.jpg', couponValueBaht: null },
  { id: 'coupon-200-baht', name: 'คูปองส่วนลด 200 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 1000, imageUrl: null, couponValueBaht: 200 },
  { id: 'cat-scratcher-sofa', name: 'ที่ลับเล็บแมว ทรงโซฟา', category: 'product', group: 'cat_toy', badge: null, pointsCost: 1200, imageUrl: null, couponValueBaht: null },
  { id: 'yoyo-tofu-litter-7l-twin-pack', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร แพ็กคู่', category: 'product', group: 'cat_litter', badge: null, pointsCost: 1700, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', couponValueBaht: null },
  { id: 'pearl-fur-care-spray', name: 'สเปรย์บำรุงขน Pearl Fur Care', category: 'product', group: 'grooming', badge: 'new', pointsCost: 1800, imageUrl: null, couponValueBaht: null },
  { id: 'foldable-cat-tunnel', name: 'อุโมงค์แมว พับเก็บได้', category: 'product', group: 'cat_toy', badge: null, pointsCost: 2200, imageUrl: null, couponValueBaht: null },
  { id: 'coupon-500-baht', name: 'คูปองส่วนลด 500 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 2500, imageUrl: null, couponValueBaht: 500 }
]

const RECOMMENDED_REWARD_IDS = ['coupon-50-baht', 'yoyo-pet-wipes-80', 'yoyo-tofu-litter-7l', 'berry-cream-spray-60ml']

export function createMockRewardRepository(): RewardRepository {
  return {
    async getRecommendedRewards() {
      return RECOMMENDED_REWARD_IDS.map(id => MOCK_REWARDS.find(reward => reward.id === id)!)
    },

    async getRewards() {
      return MOCK_REWARDS
    },

    async getRecentRedemptions(_memberId, limit) {
      const redemptions: RewardRedemption[] = [
        { id: 'redemption-2', rewardName: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', couponValueBaht: null, redeemedAt: '2026-11-03', status: 'shipping' },
        { id: 'redemption-1', rewardName: 'คูปองส่วนลด 50 บาท', imageUrl: null, couponValueBaht: 50, redeemedAt: '2026-11-05', status: 'used' }
      ]
      return redemptions.slice(0, limit)
    }
  }
}
