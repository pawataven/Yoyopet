import { useRepositories } from '~/repositories'

export function useMemberDashboard() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: dashboard, status, error, refresh } = useAsyncData(
    'member-dashboard',
    () => (userId.value ? memberRepository.getDashboard(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  return {
    dashboard,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
