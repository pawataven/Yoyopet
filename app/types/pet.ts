export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'other'
export type PetSex = 'female' | 'male' | 'unknown'

export interface Pet {
  id: string
  name: string
  species: PetSpecies
  breed: string | null
  sex: PetSex | null
  birthDate: string | null
  weightKg: number | null
  photoUrl: string | null
}

export type NewPet = Omit<Pet, 'id' | 'photoUrl'>

export interface PetBirthdayCoupon {
  petId: string
  petName: string
  petPhotoUrl: string | null
  discountPercent: number
  couponCode: string
  expiresAt: string
  isClaimed: boolean
}
