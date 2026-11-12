import type { RedeemedCoupon, Reward, RewardDetail, RewardRedemption, RewardRedemptionResult, ShipmentTracking } from '~/types/reward'
import { toLocalIsoDate } from '~/utils/format'

export interface RewardRepository {
  getRecommendedRewards(): Promise<Reward[]>
  getRewards(): Promise<Reward[]>
  getRewardDetail(rewardId: string): Promise<RewardDetail | null>
  // Same group first, then the closest point cost
  getSimilarRewards(rewardId: string, limit: number): Promise<Reward[]>
  getRecentRedemptions(memberId: string, limit: number): Promise<RewardRedemption[]>
  // Newest first, redeemed on or after the given date (YYYY-MM-DD)
  getRedemptionHistory(memberId: string, since: string): Promise<RewardRedemption[]>
  // null for coupons and for products that haven't been booked with a carrier yet
  getShipmentTracking(memberId: string, redemptionId: string): Promise<ShipmentTracking | null>
  // Points are deducted by the backend in the same transaction that reserves stock; delivery rewards need an address
  redeemReward(memberId: string, rewardId: string, quantity: number, shippingAddressId: string | null): Promise<RewardRedemptionResult>
}

export class RewardRedemptionError extends Error {
  constructor(readonly reason: 'not_found' | 'insufficient_points' | 'out_of_stock' | 'missing_address') {
    super(reason)
  }
}

const MOCK_MEMBER_POINTS = 1280
const MOCK_DEFAULT_STOCK = 50
const MOCK_COUPON_VALID_DAYS = 30
const MOCK_COUPON_MIN_SPEND_MULTIPLIER = 6

type MockRewardDetailFields = Partial<Omit<RewardDetail, keyof Reward>>

const MOCK_REWARD_DETAILS: Record<string, MockRewardDetailFields> = {
  'yoyo-tofu-litter-7l': {
    tagline: 'ทรายแมวเต้าหู้ธรรมชาติ จับตัวเป็นก้อนภายใน 3 วินาที',
    // TODO: replace the repeated photo with the real product gallery (front, back, texture, flavours)
    imageUrls: [
      '/rewards/yoyo-tofu-litter-7l.jpg',
      '/rewards/yoyo-tofu-litter-7l.jpg',
      '/rewards/yoyo-tofu-litter-7l.jpg',
      '/rewards/yoyo-tofu-litter-7l.jpg'
    ],
    sizeLabel: '7 ลิตร (2.0 กก.)',
    stockRemaining: 32,
    highlights: [
      'ผลิตจากกากถั่วเหลืองธรรมชาติ 100% ทิ้งลงชักโครกได้',
      'ดูดซับเร็ว จับตัวเป็นก้อนใน 3 วินาที ลดกลิ่นอับชื้น',
      'ฝุ่นน้อย ปลอดภัยต่อแมวและเจ้าของ'
    ]
  },
  'yoyo-tofu-litter-7l-twin-pack': {
    tagline: 'ทรายแมวเต้าหู้ธรรมชาติ แพ็กคู่สุดคุ้ม',
    sizeLabel: '7 ลิตร × 2 ถุง',
    stockRemaining: 18
  },
  'yoyo-pet-wipes-80': {
    tagline: 'ทิชชู่เปียกสำหรับสัตว์เลี้ยง อ่อนโยน ไม่มีแอลกอฮอล์',
    sizeLabel: '80 แผ่น'
  },
  'berry-cream-spray-60ml': {
    tagline: 'สเปรย์น้ำหอมกลิ่นเบอร์รี่ครีม หอมนาน อ่อนโยนต่อขน',
    sizeLabel: '60 มล.',
    stockRemaining: 12
  }
}

const MOCK_COUPON_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function createMockCoupon(rewardDetail: RewardDetail): RedeemedCoupon {
  const suffix = Array.from({ length: 4 }, () => MOCK_COUPON_CODE_ALPHABET[Math.floor(Math.random() * MOCK_COUPON_CODE_ALPHABET.length)]).join('')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (rewardDetail.couponValidDays ?? MOCK_COUPON_VALID_DAYS))
  return {
    code: `YY${rewardDetail.couponValueBaht ?? ''}-${suffix}`,
    expiresAt: toLocalIsoDate(expiresAt),
    minSpendBaht: rewardDetail.couponMinSpendBaht
  }
}

function toRewardDetail(reward: Reward): RewardDetail {
  const isCoupon = reward.category === 'coupon'
  return {
    ...reward,
    tagline: isCoupon ? 'ใช้เป็นส่วนลดตอนสั่งซื้อที่ร้าน YoYo ทุกช่องทาง' : null,
    brand: 'yoyoPet',
    imageUrls: reward.imageUrl ? [reward.imageUrl] : [],
    sizeLabel: null,
    stockRemaining: MOCK_DEFAULT_STOCK,
    fulfillment: isCoupon ? 'coupon' : 'delivery',
    deliveryLeadTime: isCoupon ? null : '3–5 วันทำการ',
    highlights: [],
    couponMinSpendBaht: isCoupon && reward.couponValueBaht ? reward.couponValueBaht * MOCK_COUPON_MIN_SPEND_MULTIPLIER : null,
    couponValidDays: isCoupon ? MOCK_COUPON_VALID_DAYS : null,
    ...MOCK_REWARD_DETAILS[reward.id]
  }
}

// TODO: imageUrl null items still need product photos
const MOCK_REWARDS: Reward[] = [
  { id: 'coupon-50-baht', name: 'คูปองส่วนลด 50 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 300, imageUrl: null, couponValueBaht: 50, redemptionCount: 1840, addedAt: '2026-01-10' },
  { id: 'matatabi-stick', name: 'ไม้มาทาทาบิ ขัดฟันแมว', category: 'product', group: 'cat_toy', badge: null, pointsCost: 400, imageUrl: null, couponValueBaht: null, redemptionCount: 612, addedAt: '2026-05-02' },
  { id: 'double-ended-cotton-swab-200', name: 'สำลีก้านปลายคู่ 200 ก้าน', category: 'product', group: 'cleaning', badge: null, pointsCost: 450, imageUrl: null, couponValueBaht: null, redemptionCount: 388, addedAt: '2026-03-18' },
  { id: 'pet-spa-gloves', name: 'ถุงมือสปา Pet SPA Gloves', category: 'product', group: 'cleaning', badge: 'new', pointsCost: 450, imageUrl: null, couponValueBaht: null, redemptionCount: 205, addedAt: '2026-10-28' },
  { id: 'coupon-100-baht', name: 'คูปองส่วนลด 100 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 550, imageUrl: null, couponValueBaht: 100, redemptionCount: 1320, addedAt: '2026-01-10' },
  { id: 'yoyo-pet-wipes-80', name: 'ทิชชู่เปียก Pet Wipes 80 แผ่น', category: 'product', group: 'cleaning', badge: 'best_seller', pointsCost: 600, imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', couponValueBaht: null, redemptionCount: 1475, addedAt: '2026-02-14' },
  { id: 'feather-teaser-wand', name: 'ไม้ตกแมว ขนนก', category: 'product', group: 'cat_toy', badge: null, pointsCost: 350, imageUrl: null, couponValueBaht: null, redemptionCount: 540, addedAt: '2026-04-21' },
  { id: 'eye-clean-wipe', name: 'แผ่นเช็ดคราบน้ำตา Eye Clean', category: 'product', group: 'cleaning', badge: null, pointsCost: 500, imageUrl: null, couponValueBaht: null, redemptionCount: 430, addedAt: '2026-06-09' },
  { id: 'pet-grooming-brush', name: 'แปรงหวีขนสัตว์เลี้ยง', category: 'product', group: 'grooming', badge: null, pointsCost: 650, imageUrl: null, couponValueBaht: null, redemptionCount: 318, addedAt: '2026-07-15' },
  { id: 'litter-deodorizer-lavender', name: 'ผงดับกลิ่นทรายแมว Lavender', category: 'product', group: 'grooming', badge: null, pointsCost: 700, imageUrl: null, couponValueBaht: null, redemptionCount: 702, addedAt: '2026-08-03' },
  { id: 'yoyo-tofu-litter-7l', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', category: 'product', group: 'cat_litter', badge: null, pointsCost: 900, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', couponValueBaht: null, redemptionCount: 1610, addedAt: '2026-02-14' },
  { id: 'berry-cream-spray-60ml', name: 'สเปรย์น้ำหอม Berry Cream 60ml', category: 'product', group: 'grooming', badge: null, pointsCost: 1500, imageUrl: '/rewards/berry-cream-spray-60ml.jpg', couponValueBaht: null, redemptionCount: 655, addedAt: '2026-09-12' },
  { id: 'coupon-200-baht', name: 'คูปองส่วนลด 200 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 1000, imageUrl: null, couponValueBaht: 200, redemptionCount: 480, addedAt: '2026-03-01' },
  { id: 'cat-scratcher-sofa', name: 'ที่ลับเล็บแมว ทรงโซฟา', category: 'product', group: 'cat_toy', badge: null, pointsCost: 1200, imageUrl: null, couponValueBaht: null, redemptionCount: 260, addedAt: '2026-10-05' },
  { id: 'yoyo-tofu-litter-7l-twin-pack', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร แพ็กคู่', category: 'product', group: 'cat_litter', badge: null, pointsCost: 1700, imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', couponValueBaht: null, redemptionCount: 198, addedAt: '2026-08-20' },
  { id: 'pearl-fur-care-spray', name: 'สเปรย์บำรุงขน Pearl Fur Care', category: 'product', group: 'grooming', badge: 'new', pointsCost: 1800, imageUrl: null, couponValueBaht: null, redemptionCount: 94, addedAt: '2026-11-01' },
  { id: 'foldable-cat-tunnel', name: 'อุโมงค์แมว พับเก็บได้', category: 'product', group: 'cat_toy', badge: null, pointsCost: 2200, imageUrl: null, couponValueBaht: null, redemptionCount: 71, addedAt: '2026-10-18' },
  { id: 'coupon-500-baht', name: 'คูปองส่วนลด 500 บาท', category: 'coupon', group: 'coupon', badge: null, pointsCost: 2500, imageUrl: null, couponValueBaht: 500, redemptionCount: 133, addedAt: '2026-06-30' }
]

const MOCK_REDEMPTIONS: RewardRedemption[] = [
  { id: 'redemption-6', rewardId: 'yoyo-tofu-litter-7l', referenceCode: 'RW-2611-0042', pointsSpent: 900, rewardName: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', couponValueBaht: null, redeemedAt: '2026-11-03', status: 'shipping' },
  { id: 'redemption-5', rewardId: 'coupon-50-baht', referenceCode: 'YY50-2KD1', pointsSpent: 300, rewardName: 'คูปองส่วนลด 50 บาท', imageUrl: null, couponValueBaht: 50, redeemedAt: '2026-11-05', status: 'used' },
  { id: 'redemption-4', rewardId: 'pet-spa-gloves', referenceCode: 'RW-2610-0187', pointsSpent: 450, rewardName: 'ถุงมือสปา Pet SPA Gloves', imageUrl: null, couponValueBaht: null, redeemedAt: '2026-10-20', status: 'delivered' },
  { id: 'redemption-3', rewardId: 'coupon-100-baht', referenceCode: 'YY100-7QX3', pointsSpent: 550, rewardName: 'คูปองส่วนลด 100 บาท', imageUrl: null, couponValueBaht: 100, redeemedAt: '2026-10-12', status: 'ready_to_use' },
  { id: 'redemption-2', rewardId: 'yoyo-pet-wipes-80', referenceCode: 'RW-2609-0921', pointsSpent: 600, rewardName: 'ทิชชู่เปียก Pet Wipes 80 แผ่น', imageUrl: '/rewards/yoyo-pet-wipes-80.jpg', couponValueBaht: null, redeemedAt: '2026-09-28', status: 'delivered' },
  { id: 'redemption-1', rewardId: 'coupon-50-baht', referenceCode: 'YY50-11ZP', pointsSpent: 300, rewardName: 'คูปองส่วนลด 50 บาท', imageUrl: null, couponValueBaht: 50, redeemedAt: '2026-09-02', status: 'expired' }
]

const MOCK_SHIPMENT_TRACKINGS: ShipmentTracking[] = [
  {
    redemptionId: 'redemption-6',
    carrierName: 'Flash Express',
    trackingNumber: 'TH0123456789A',
    currentStage: 'in_transit',
    estimatedDeliveryDate: '2026-11-07',
    stages: [
      { stage: 'redeemed', occurredAt: '2026-11-03T14:20' },
      { stage: 'preparing', occurredAt: '2026-11-04T10:05' },
      { stage: 'handed_to_carrier', occurredAt: '2026-11-05T16:40' },
      { stage: 'in_transit', occurredAt: '2026-11-06T08:15' },
      { stage: 'delivered', occurredAt: null }
    ]
  }
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

    async getRewardDetail(rewardId) {
      const reward = MOCK_REWARDS.find(candidate => candidate.id === rewardId)
      return reward ? toRewardDetail(reward) : null
    },

    async getSimilarRewards(rewardId, limit) {
      const reward = MOCK_REWARDS.find(candidate => candidate.id === rewardId)
      if (!reward) return []
      const similarityScore = (candidate: Reward) =>
        (candidate.group === reward.group ? 0 : 1_000_000) + Math.abs(candidate.pointsCost - reward.pointsCost)
      return MOCK_REWARDS
        .filter(candidate => candidate.id !== rewardId)
        .toSorted((a, b) => similarityScore(a) - similarityScore(b))
        .slice(0, limit)
    },

    // Mock only: validates and reports the result, but doesn't change the mock member balance or stock
    async redeemReward(_memberId, rewardId, quantity, shippingAddressId) {
      const reward = MOCK_REWARDS.find(candidate => candidate.id === rewardId)
      if (!reward) throw new RewardRedemptionError('not_found')
      const rewardDetail = toRewardDetail(reward)
      if (rewardDetail.fulfillment === 'delivery' && !shippingAddressId) throw new RewardRedemptionError('missing_address')
      const pointsSpent = reward.pointsCost * quantity
      if (pointsSpent > MOCK_MEMBER_POINTS) throw new RewardRedemptionError('insufficient_points')
      if (quantity > rewardDetail.stockRemaining) throw new RewardRedemptionError('out_of_stock')
      const today = toLocalIsoDate(new Date())
      return {
        redemptionId: `redemption-${Date.now()}`,
        referenceCode: `RW-${today.slice(2, 4)}${today.slice(5, 7)}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        pointsSpent,
        remainingPoints: MOCK_MEMBER_POINTS - pointsSpent,
        coupons: rewardDetail.fulfillment === 'coupon' ? Array.from({ length: quantity }, () => createMockCoupon(rewardDetail)) : []
      }
    },

    async getRecentRedemptions(_memberId, limit) {
      return MOCK_REDEMPTIONS.slice(0, limit)
    },

    async getRedemptionHistory(_memberId, since) {
      return MOCK_REDEMPTIONS.filter(redemption => redemption.redeemedAt >= since)
    },

    async getShipmentTracking(_memberId, redemptionId) {
      return MOCK_SHIPMENT_TRACKINGS.find(tracking => tracking.redemptionId === redemptionId) ?? null
    }
  }
}
