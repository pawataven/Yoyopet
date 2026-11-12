import type { MaybeRefOrGetter } from 'vue'
import { useRepositories } from '~/repositories'

// Pass no version to read the terms currently in force
export function useMembershipTerms(requestedVersion: MaybeRefOrGetter<string | null>) {
  const { terms: termsRepository } = useRepositories()

  // One request resolves the version list and the document together, so the server never renders a half-known state
  const { data, status, error } = useAsyncData(
    () => `membership-terms-${toValue(requestedVersion) ?? 'current'}`,
    async () => {
      const versions = await termsRepository.getMembershipTermsVersions()
      const version = toValue(requestedVersion) ?? versions[0]?.version ?? null
      const terms = version ? await termsRepository.getMembershipTerms(version) : null
      return { versions, terms }
    },
    { default: () => null }
  )

  const versions = computed(() => data.value?.versions ?? [])
  const terms = computed(() => data.value?.terms ?? null)
  const currentVersion = computed(() => versions.value[0]?.version ?? null)

  const previousVersion = computed(() => {
    const shownIndex = versions.value.findIndex(entry => entry.version === terms.value?.version)
    return shownIndex === -1 ? null : versions.value[shownIndex + 1] ?? null
  })

  return {
    terms,
    versions,
    currentVersion,
    previousVersion,
    isCurrent: computed(() => terms.value !== null && terms.value.version === currentVersion.value),
    isLoading: computed(() => status.value === 'pending'),
    error
  }
}
