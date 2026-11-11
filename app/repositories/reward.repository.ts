import type { Reward } from '~/types/reward'

export interface RewardRepository {
  getRecommendedRewards(): Promise<Reward[]>
}

export function createMockRewardRepository(): RewardRepository {
  return {
    async getRecommendedRewards() {
      return [
        {
          id: 'coupon-50-baht',
          name: 'คูปองส่วนลด 50 บาท',
          category: 'coupon',
          pointsCost: 300,
          imageUrl: null,
          couponValueBaht: 50
        },
        {
          id: 'yoyo-pet-wipes-80',
          name: 'ทิชชู่เปียก YoYo Pet Wipes 80 แผ่น',
          category: 'product',
          pointsCost: 600,
          imageUrl: '/rewards/yoyo-pet-wipes-80.jpg',
          couponValueBaht: null
        },
        {
          id: 'yoyo-tofu-litter-7l',
          name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร',
          category: 'product',
          pointsCost: 900,
          imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg',
          couponValueBaht: null
        },
        {
          id: 'berry-cream-spray-60ml',
          name: 'สเปรย์น้ำหอม Berry Cream 60ml',
          category: 'product',
          pointsCost: 1500,
          imageUrl: '/rewards/berry-cream-spray-60ml.jpg',
          couponValueBaht: null
        }
      ]
    }
  }
}
