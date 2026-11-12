import { useRepositories } from '~/repositories'
import type { FaqTopic } from '~/types/help'

export function useFaqs(topic: FaqTopic = 'general') {
  const { help: helpRepository } = useRepositories()

  const { data: faqs, status, error, refresh } = useAsyncData(
    `help-faqs-${topic}`,
    () => helpRepository.getFaqs(topic),
    { default: () => [] }
  )

  return {
    faqs,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
