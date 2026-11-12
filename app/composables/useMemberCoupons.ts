import { useRepositories } from '~/repositories'

export function useMemberCoupons() {
  const { coupon: couponRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: coupons, status, error, refresh } = useAsyncData(
    'member-coupons',
    () => (userId.value ? couponRepository.getMemberCoupons(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    coupons,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
