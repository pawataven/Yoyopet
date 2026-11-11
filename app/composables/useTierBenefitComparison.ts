import { useRepositories } from '~/repositories'

export function useTierBenefitComparison() {
  const { member: memberRepository } = useRepositories()

  const { data: benefitComparison, status, error, refresh } = useAsyncData(
    'tier-benefit-comparison',
    () => memberRepository.getTierBenefitComparison(),
    { default: () => [] }
  )

  return {
    benefitComparison,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
