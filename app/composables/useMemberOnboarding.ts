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
      'notification-preferences',
      'member-consents'
    ])
    return result
  }

  async function requestPhoneVerification(phone: string) {
    if (!userId.value) throw new Error('not_signed_in')
    return memberRepository.requestPhoneVerification(userId.value, phone)
  }

  async function verifyPhone(phone: string, code: string) {
    if (!userId.value) throw new Error('not_signed_in')
    await memberRepository.verifyPhone(userId.value, phone, code)
  }

  return {
    onboardingStatus,
    isOnboardingRequired,
    isLoading: computed(() => status.value === 'pending'),
    refresh,
    completeOnboarding,
    requestPhoneVerification,
    verifyPhone
  }
}
