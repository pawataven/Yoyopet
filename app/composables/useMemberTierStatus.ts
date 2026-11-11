import { useRepositories } from '~/repositories'

export function useMemberTierStatus() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: tierStatus, status, error, refresh } = useAsyncData(
    'member-tier-status',
    () => (userId.value ? memberRepository.getTierStatus(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  return {
    tierStatus,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
