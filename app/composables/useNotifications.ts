import { useRepositories } from '~/repositories'

export function useNotifications() {
  const { notification: notificationRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: notifications, status, error, refresh } = useAsyncData(
    'member-notifications',
    () => (userId.value ? notificationRepository.getNotifications(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  const unreadCount = computed(() => notifications.value.filter(notification => !notification.isRead).length)

  function setReadLocally(isTarget: (id: string) => boolean) {
    notifications.value = notifications.value.map(notification =>
      isTarget(notification.id) ? { ...notification, isRead: true } : notification
    )
  }

  async function markAsRead(notificationId: string) {
    if (!userId.value) return
    const previous = notifications.value
    setReadLocally(id => id === notificationId)
    try {
      await notificationRepository.markAsRead(userId.value, [notificationId])
    } catch {
      notifications.value = previous
    }
  }

  async function markAllAsRead() {
    if (!userId.value || unreadCount.value === 0) return
    const previous = notifications.value
    setReadLocally(() => true)
    try {
      await notificationRepository.markAllAsRead(userId.value)
    } catch {
      notifications.value = previous
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    markAsRead,
    markAllAsRead
  }
}
