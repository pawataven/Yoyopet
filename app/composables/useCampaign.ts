import type { MaybeRefOrGetter } from 'vue'
import { useRepositories } from '~/repositories'

export function useCampaign(campaignId: MaybeRefOrGetter<string>) {
  const { campaign: campaignRepository } = useRepositories()

  const { data: campaign, status, error, refresh } = useAsyncData(
    () => `campaign-${toValue(campaignId)}`,
    () => campaignRepository.getCampaign(toValue(campaignId)),
    { default: () => null }
  )

  return {
    campaign,
    isLoading: computed(() => status.value === 'pending'),
    error,
    refresh
  }
}
