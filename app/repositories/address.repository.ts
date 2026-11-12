import { MAX_SHIPPING_ADDRESSES } from '~/types/address'
import type { ShippingAddress, ShippingAddressInput } from '~/types/address'

export interface AddressRepository {
  getAddresses(memberId: string): Promise<ShippingAddress[]>
  setDefaultAddress(memberId: string, addressId: string): Promise<ShippingAddress[]>
  // Each write returns the whole list because one change can move the default to another address
  addAddress(memberId: string, input: ShippingAddressInput): Promise<ShippingAddress[]>
  updateAddress(memberId: string, addressId: string, input: ShippingAddressInput): Promise<ShippingAddress[]>
  deleteAddress(memberId: string, addressId: string): Promise<ShippingAddress[]>
}

export function createMockAddressRepository(): AddressRepository {
  let addresses: ShippingAddress[] = [
    {
      id: 'address-home',
      label: 'บ้าน',
      recipientName: 'มายด์ ใจดี',
      phone: '081-234-4521',
      addressLine: '99/12 ซ.ลาดพร้าว 15',
      subdistrict: 'จอมพล',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      postalCode: '10900',
      isDefault: true
    },
    {
      id: 'address-office',
      label: 'ที่ทำงาน',
      recipientName: 'มายด์ ใจดี',
      phone: '081-234-4521',
      addressLine: '88 อาคารชินวัตรทาวเวอร์ ชั้น 12 ถ.วิภาวดีรังสิต',
      subdistrict: 'จตุจักร',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      postalCode: '10900',
      isDefault: false
    }
  ]
  let nextAddressNumber = addresses.length + 1

  // The first address is always the default, and a new default clears the old one
  function withDefault(list: ShippingAddress[], defaultId: string | null) {
    const resolvedDefaultId = defaultId ?? list[0]?.id ?? null
    return list.map(address => ({ ...address, isDefault: address.id === resolvedDefaultId }))
  }

  function currentDefaultId() {
    return addresses.find(address => address.isDefault)?.id ?? null
  }

  return {
    async getAddresses() {
      return addresses
    },

    async setDefaultAddress(_memberId, addressId) {
      addresses = withDefault(addresses, addressId)
      return addresses
    },

    async addAddress(_memberId, input) {
      if (addresses.length >= MAX_SHIPPING_ADDRESSES) throw new Error('address_limit_reached')
      const id = `address-${nextAddressNumber++}`
      const isFirstAddress = addresses.length === 0
      addresses = withDefault([...addresses, { ...input, id }], input.isDefault || isFirstAddress ? id : currentDefaultId())
      return addresses
    },

    async updateAddress(_memberId, addressId, input) {
      if (!addresses.some(address => address.id === addressId)) throw new Error('address_not_found')
      const wasDefault = currentDefaultId() === addressId
      // Unticking "default" on the default address can't leave the list without one, so it stays default
      const nextDefaultId = input.isDefault || wasDefault ? addressId : currentDefaultId()
      addresses = withDefault(addresses.map(address => (address.id === addressId ? { ...input, id: addressId } : address)), nextDefaultId)
      return addresses
    },

    async deleteAddress(_memberId, addressId) {
      const wasDefault = currentDefaultId() === addressId
      const remaining = addresses.filter(address => address.id !== addressId)
      addresses = withDefault(remaining, wasDefault ? null : currentDefaultId())
      return addresses
    }
  }
}
