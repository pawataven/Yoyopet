import { useRepositories } from '~/repositories'

export function usePointsEarningRule() {
  const { help: helpRepository } = useRepositories()

  const { data: earningRule, status, error, refresh } = useAsyncData(
    'points-earning-rule',
    () => helpRepository.getPointsEarningRule(),
    { default: () => null }
  )

  return {
    earningRule,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
