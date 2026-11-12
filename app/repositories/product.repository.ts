import type { PetProductRecommendation } from '~/types/product'

export interface ProductRepository {
  getPetRecommendations(memberId: string, limit: number): Promise<PetProductRecommendation[]>
}

export function createMockProductRepository(): ProductRepository {
  // TODO: replace imageUrl null with real product photos and shopUrl with product pages once available
  const recommendations: PetProductRecommendation[] = [
    { id: 'product-tofu-litter-7l', name: 'ทรายเต้าหู้ YoYo Tofu 7 ลิตร', imageUrl: '/rewards/yoyo-tofu-litter-7l.jpg', petId: 'pet-khanompang', petName: 'ขนมปัง', shopUrl: '/#shop' },
    { id: 'product-matatabi-stick', name: 'ไม้มาทาทาบิ ขัดฟันแมว', imageUrl: null, petId: 'pet-khanompang', petName: 'ขนมปัง', shopUrl: '/#shop' },
    { id: 'product-eye-clean-wipe', name: 'แผ่นเช็ดคราบน้ำตา Eye Clean', imageUrl: null, petId: 'pet-mali', petName: 'มะลิ', shopUrl: '/#shop' },
    { id: 'product-spa-gloves', name: 'ถุงมือสปา Pet SPA Gloves', imageUrl: null, petId: 'pet-mali', petName: 'มะลิ', shopUrl: '/#shop' }
  ]

  return {
    async getPetRecommendations(_memberId, limit) {
      return recommendations.slice(0, limit)
    }
  }
}
