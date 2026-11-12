import { MAX_SHIPPING_ADDRESSES } from '~/types/address'
import type { ShippingAddressInput } from '~/types/address'
import { useRepositories } from '~/repositories'

export function useShippingAddresses() {
  const { address: addressRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: addresses, status, error, refresh } = useAsyncData(
    'shipping-addresses',
    () => (userId.value ? addressRepository.getAddresses(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  const defaultAddressId = computed(() => addresses.value.find(address => address.isDefault)?.id ?? null)
  const canAddAddress = computed(() => addresses.value.length < MAX_SHIPPING_ADDRESSES)

  async function setDefaultAddress(addressId: string) {
    if (!userId.value || addressId === defaultAddressId.value) return
    addresses.value = await addressRepository.setDefaultAddress(userId.value, addressId)
  }

  async function addAddress(input: ShippingAddressInput) {
    if (!userId.value) return
    addresses.value = await addressRepository.addAddress(userId.value, input)
  }

  async function updateAddress(addressId: string, input: ShippingAddressInput) {
    if (!userId.value) return
    addresses.value = await addressRepository.updateAddress(userId.value, addressId, input)
  }

  async function deleteAddress(addressId: string) {
    if (!userId.value) return
    addresses.value = await addressRepository.deleteAddress(userId.value, addressId)
  }

  return {
    addresses,
    defaultAddressId,
    canAddAddress,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    setDefaultAddress,
    addAddress,
    updateAddress,
    deleteAddress
  }
}
