import { useRepositories } from '~/repositories'

export function useTopSpenderMonths() {
  const { leaderboard: leaderboardRepository } = useRepositories()

  const { data: months, status, error } = useAsyncData(
    'top-spender-months',
    () => leaderboardRepository.getLeaderboardMonths(),
    { default: () => [] }
  )

  return {
    months,
    isLoading: computed(() => status.value === 'pending'),
    error
  }
}
