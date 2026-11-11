import type { Pet, PetBirthdayCoupon } from '~/types/pet'

export interface PetRepository {
  getPets(memberId: string): Promise<Pet[]>
  getCurrentBirthdayCoupon(memberId: string): Promise<PetBirthdayCoupon | null>
  claimBirthdayCoupon(memberId: string, petId: string): Promise<PetBirthdayCoupon>
}

export function createMockPetRepository(): PetRepository {
  let birthdayCoupon: PetBirthdayCoupon = {
    petId: 'pet-mali',
    petName: 'มะลิ',
    petPhotoUrl: '/pets/mali-golden-retriever.jpg',
    discountPercent: 10,
    couponCode: 'BDAY-MALI10',
    expiresAt: '2026-11-30',
    isClaimed: false
  }

  return {
    async getPets() {
      return [
        { id: 'pet-mali', name: 'มะลิ', breed: 'โกลเด้น', birthDate: '2026-07-01', photoUrl: '/pets/mali-golden-retriever.jpg' },
        { id: 'pet-khanompang', name: 'ขนมปัง', breed: 'วิเชียรมาศ', birthDate: '2025-08-15', photoUrl: '/pets/khanompang-siamese-cat.jpg' }
      ]
    },

    async getCurrentBirthdayCoupon() {
      return birthdayCoupon
    },

    async claimBirthdayCoupon() {
      birthdayCoupon = { ...birthdayCoupon, isClaimed: true }
      return birthdayCoupon
    }
  }
}
