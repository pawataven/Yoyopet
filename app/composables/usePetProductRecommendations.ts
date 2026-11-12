import { useRepositories } from '~/repositories'

export function usePetProductRecommendations(limit = 4) {
  const { product: productRepository } = useRepositories()
  const { userId } = useAuth()

  const { data: recommendations, status, error, refresh } = useAsyncData(
    `pet-product-recommendations-${limit}`,
    () => (userId.value ? productRepository.getPetRecommendations(userId.value, limit) : Promise.resolve([])),
    { watch: [userId], default: () => [] }
  )

  return {
    recommendations,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
