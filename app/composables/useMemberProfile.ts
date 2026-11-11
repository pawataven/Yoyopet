import type { MemberProfileUpdate } from '~/types/member'
import { useRepositories } from '~/repositories'

export function useMemberProfile() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: profile, status, error, refresh } = useAsyncData(
    'member-profile',
    () => (userId.value ? memberRepository.getProfile(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  async function saveProfile(update: MemberProfileUpdate) {
    if (!userId.value) return
    profile.value = await memberRepository.updateProfile(userId.value, update)
    await refreshNuxtData('member-summary')
  }

  const isUploadingAvatar = ref(false)

  async function uploadAvatar(file: File) {
    if (!userId.value) return
    isUploadingAvatar.value = true
    try {
      profile.value = await memberRepository.uploadAvatar(userId.value, file)
    } finally {
      isUploadingAvatar.value = false
    }
  }

  return {
    profile,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    saveProfile,
    isUploadingAvatar: readonly(isUploadingAvatar),
    uploadAvatar
  }
}
