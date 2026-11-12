import type { NewPet, Pet, PetBirthdayCoupon } from '~/types/pet'

export interface PetRepository {
  getPets(memberId: string): Promise<Pet[]>
  addPet(memberId: string, newPet: NewPet, photo: File | null): Promise<Pet>
  getCurrentBirthdayCoupon(memberId: string): Promise<PetBirthdayCoupon | null>
  claimBirthdayCoupon(memberId: string, petId: string): Promise<PetBirthdayCoupon>
}

export function createMockPetRepository(): PetRepository {
  let pets: Pet[] = [
    { id: 'pet-mali', name: 'มะลิ', species: 'dog', breed: 'โกลเด้น รีทรีฟเวอร์', sex: 'female', birthDate: '2026-07-12', weightKg: 8.5, photoUrl: '/pets/mali-golden-retriever.jpg' },
    { id: 'pet-khanompang', name: 'ขนมปัง', species: 'cat', breed: 'วิเชียรมาศ', sex: 'male', birthDate: '2025-10-01', weightKg: 4.2, photoUrl: '/pets/khanompang-siamese-cat.jpg' }
  ]

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
      return pets
    },

    // Mock only: a blob URL lives in this browser tab, the real upload goes to storage
    async addPet(_memberId, newPet, photo) {
      const pet: Pet = {
        ...newPet,
        id: `pet-${Date.now()}`,
        photoUrl: photo ? URL.createObjectURL(photo) : null
      }
      pets = [...pets, pet]
      return pet
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
