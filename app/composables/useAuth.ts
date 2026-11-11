// TODO: replace with the backend auth session once connected
export function useAuth() {
  const userId = useState<string | null>('auth-user-id', () => 'mock-member-id')

  return {
    userId: readonly(userId),
    isLoggedIn: computed(() => userId.value !== null)
  }
}
