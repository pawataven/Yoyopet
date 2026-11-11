import type { PromoBanner } from '~/types/banner'

export interface BannerRepository {
  getActiveHomeBanners(): Promise<PromoBanner[]>
}

export function createMockBannerRepository(): BannerRepository {
  return {
    async getActiveHomeBanners() {
      return [
        { id: 'banner-yoyo-1', imageUrl: '/banners/yoyo-for-your-pet.jpg', alt: 'YOYO For your pet', linkUrl: null },
        { id: 'banner-yoyo-2', imageUrl: '/banners/yoyo-for-your-pet.jpg', alt: 'YOYO For your pet', linkUrl: '/rewards' },
        { id: 'banner-yoyo-3', imageUrl: '/banners/yoyo-for-your-pet.jpg', alt: 'YOYO For your pet', linkUrl: null }
      ]
    }
  }
}
