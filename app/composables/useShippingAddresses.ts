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

  async function setDefaultAddress(addressId: string) {
    if (!userId.value || addressId === defaultAddressId.value) return
    addresses.value = await addressRepository.setDefaultAddress(userId.value, addressId)
  }

  return {
    addresses,
    defaultAddressId,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    setDefaultAddress
  }
}
