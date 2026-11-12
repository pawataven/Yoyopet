import { useRepositories } from '~/repositories'

export function usePrivacyRequests() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: privacyRequests, status, error, refresh } = useAsyncData(
    'member-privacy-requests',
    () => (userId.value ? memberRepository.getPrivacyRequests(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  async function requestDataExport() {
    if (!userId.value) return
    privacyRequests.value = await memberRepository.requestDataExport(userId.value)
  }

  async function requestAccountDeletion() {
    if (!userId.value) return
    privacyRequests.value = await memberRepository.requestAccountDeletion(userId.value)
  }

  return {
    privacyRequests,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    requestDataExport,
    requestAccountDeletion
  }
}
