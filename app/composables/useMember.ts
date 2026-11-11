import { useRepositories } from '~/repositories'

export function useMember() {
  const { member: memberRepository } = useRepositories()
  const { userId, isLoggedIn } = useAuth()

  const { data: member, status, error, refresh } = useAsyncData(
    'member-summary',
    () => (userId.value ? memberRepository.getSummary(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  return {
    member,
    isLoggedIn,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
