export interface ShippingAddress {
  id: string
  // Member-chosen nickname such as บ้าน or ที่ทำงาน
  label: string | null
  recipientName: string
  phone: string
  addressLine: string
  subdistrict: string
  district: string
  province: string
  postalCode: string
  isDefault: boolean
}

export type ShippingAddressInput = Omit<ShippingAddress, 'id'>

export const MAX_SHIPPING_ADDRESSES = 5
