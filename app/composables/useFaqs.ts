import { useRepositories } from '~/repositories'

export function useFaqs() {
  const { help: helpRepository } = useRepositories()

  const { data: faqs, status, error, refresh } = useAsyncData(
    'help-faqs',
    () => helpRepository.getFaqs(),
    { default: () => [] }
  )

  return {
    faqs,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
