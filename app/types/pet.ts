export interface Pet {
  id: string
  name: string
  breed: string
  birthDate: string | null
  photoUrl: string | null
}

export interface PetBirthdayCoupon {
  petId: string
  petName: string
  petPhotoUrl: string | null
  discountPercent: number
  couponCode: string
  expiresAt: string
  isClaimed: boolean
}
