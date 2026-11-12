import { useRepositories } from '~/repositories'

export function useTopSpenderPastWinners(limit = 3) {
  const { leaderboard: leaderboardRepository } = useRepositories()

  const { data: pastWinners, status, error } = useAsyncData(
    `top-spender-past-winners-${limit}`,
    () => leaderboardRepository.getPastWinners(limit),
    { default: () => [] }
  )

  return {
    pastWinners,
    isLoading: computed(() => status.value === 'pending'),
    error
  }
}
