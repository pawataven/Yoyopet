import { useRepositories } from '~/repositories'

export function useTopSpenderLeaderboard() {
  const { leaderboard: leaderboardRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: leaderboard, status, error, refresh } = useAsyncData(
    'top-spender-leaderboard',
    () => leaderboardRepository.getMonthlyTopSpenders(userId.value),
    { watch: [userId], default: () => null }
  )

  return {
    leaderboard,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
