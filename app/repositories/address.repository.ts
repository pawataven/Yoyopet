import type { ShippingAddress } from '~/types/address'

export interface AddressRepository {
  getAddresses(memberId: string): Promise<ShippingAddress[]>
  setDefaultAddress(memberId: string, addressId: string): Promise<ShippingAddress[]>
}

export function createMockAddressRepository(): AddressRepository {
  let addresses: ShippingAddress[] = [
    {
      id: 'address-home',
      label: 'บ้าน',
      recipientName: 'คุณมายด์ ใจดี',
      phone: '081-234-4521',
      addressLine: '99/12 ซ.สุขุมวิท 50',
      subdistrict: 'พระโขนง',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110',
      isDefault: true
    },
    {
      id: 'address-office',
      label: 'ที่ทำงาน',
      recipientName: 'คุณมายด์ ใจดี',
      phone: '081-234-4521',
      addressLine: '888 อาคารเอบีซี ชั้น 12 ถ.พระราม 4',
      subdistrict: 'วังใหม่',
      district: 'ปทุมวัน',
      province: 'กรุงเทพมหานคร',
      postalCode: '10330',
      isDefault: false
    }
  ]

  return {
    async getAddresses() {
      return addresses
    },

    async setDefaultAddress(_memberId, addressId) {
      addresses = addresses.map(address => ({ ...address, isDefault: address.id === addressId }))
      return addresses
    }
  }
}
