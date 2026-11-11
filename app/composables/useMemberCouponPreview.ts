import { useRepositories } from '~/repositories'

export function useMemberCouponPreview(limit = 2) {
  const { coupon: couponRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: couponPreview, status, error, refresh } = useAsyncData(
    `member-coupon-preview-${limit}`,
    () => (userId.value ? couponRepository.getActiveCouponPreview(userId.value, limit) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  return {
    couponPreview,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
