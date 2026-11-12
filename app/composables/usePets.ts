import type { NewPet } from '~/types/pet'
import { useRepositories } from '~/repositories'

export function usePets() {
  const { pet: petRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: pets, status, error, refresh } = useAsyncData(
    'member-pets',
    () => (userId.value ? petRepository.getPets(userId.value) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  async function addPet(newPet: NewPet, photo: File | null) {
    if (!userId.value) return
    await petRepository.addPet(userId.value, newPet, photo)
    await refresh()
  }

  return {
    pets,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh,
    addPet
  }
}
