import { useRepositories } from '~/repositories'

// A null month means the month that is still running
export function useTopSpenderLeaderboard(month: MaybeRefOrGetter<string | null> = null) {
  const { leaderboard: leaderboardRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: leaderboard, status, error, refresh } = useAsyncData(
    () => `top-spender-leaderboard-${toValue(month) ?? 'current'}`,
    () => leaderboardRepository.getMonthlyTopSpenders(userId.value, toValue(month) ?? undefined),
    { watch: [userId], default: () => null }
  )

  return {
    leaderboard,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
