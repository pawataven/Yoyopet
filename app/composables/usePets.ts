import { useRepositories } from '~/repositories'

export function usePets() {
  const { pet: petRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: pets, status, error, refresh } = useAsyncData(
    'member-pets',
    () => (userId.value ? petRepository.getPets(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    pets,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
