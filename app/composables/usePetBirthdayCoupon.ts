import { useRepositories } from '~/repositories'

export function usePetBirthdayCoupon() {
  const { pet: petRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: birthdayCoupon, status, error, refresh } = useAsyncData(
    'pet-birthday-coupon',
    () => (userId.value ? petRepository.getCurrentBirthdayCoupon(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  const isClaiming = ref(false)
  const claimError = ref<unknown>(null)

  async function claimBirthdayCoupon() {
    if (!userId.value || !birthdayCoupon.value || birthdayCoupon.value.isClaimed) return
    isClaiming.value = true
    claimError.value = null
    try {
      birthdayCoupon.value = await petRepository.claimBirthdayCoupon(userId.value, birthdayCoupon.value.petId)
    } catch (caughtError) {
      claimError.value = caughtError
    } finally {
      isClaiming.value = false
    }
  }

  return {
    birthdayCoupon,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    isClaiming: readonly(isClaiming),
    claimError: readonly(claimError),
    claimBirthdayCoupon
  }
}
