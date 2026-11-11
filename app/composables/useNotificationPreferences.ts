import type { NotificationPreferences } from '~/types/member'
import { useRepositories } from '~/repositories'

export function useNotificationPreferences() {
  const { member: memberRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: preferences, status, error, refresh } = useAsyncData(
    'notification-preferences',
    () => (userId.value ? memberRepository.getNotificationPreferences(userId.value) : Promise.resolve(null)),
    { watch: [userId], default: () => null }
  )

  async function savePreferences(updatedPreferences: NotificationPreferences) {
    if (!userId.value) return
    preferences.value = await memberRepository.updateNotificationPreferences(userId.value, updatedPreferences)
  }

  return {
    preferences,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    savePreferences
  }
}
