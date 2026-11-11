import { useRepositories } from '~/repositories'

export function useTierLevels() {
  const { member: memberRepository } = useRepositories()

  const { data: tierLevels, status, error, refresh } = useAsyncData(
    'tier-levels',
    () => memberRepository.getTierLevels(),
    { default: () => [] }
  )

  return {
    tierLevels,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
