import { useRepositories } from '~/repositories'

export function useHomeBanners() {
  const { banner: bannerRepository } = useRepositories()

  const { data: banners, status, error, refresh } = useAsyncData(
    'home-banners',
    () => bannerRepository.getActiveHomeBanners(),
    { default: () => [] }
  )

  return {
    banners,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
