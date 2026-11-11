import type { MemberOnboarding } from '~/types/member'
import { useRepositories } from '~/repositories'

export function useMemberOnboarding() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: onboardingStatus, status, refresh } = useAsyncData(
    'member-onboarding-status',
    () => (userId.value ? memberRepository.getOnboardingStatus(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  const isOnboardingRequired = computed(() => onboardingStatus.value?.isRequired ?? false)

  async function completeOnboarding(onboarding: MemberOnboarding) {
    if (!userId.value) return { awardedPoints: 0 }
    const result = await memberRepository.completeOnboarding(userId.value, onboarding)
    await refreshNuxtData([
      'member-onboarding-status',
      'member-profile',
      'member-summary',
      'notification-preferences'
    ])
    return result
  }

  return {
    onboardingStatus,
    isOnboardingRequired,
    isLoading: computed(() => status.value === 'pending'),
    refresh,
    completeOnboarding
  }
}
