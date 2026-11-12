import type { MaybeRefOrGetter } from 'vue'
import { useRepositories } from '~/repositories'

// Pass no version to read the terms currently in force
export function useMembershipTerms(requestedVersion: MaybeRefOrGetter<string | null>) {
  const { terms: termsRepository } = useRepositories()

  const { data: versions } = useAsyncData(
    'membership-terms-versions',
    () => termsRepository.getMembershipTermsVersions(),
    { default: () => [] }
  )

  const currentVersion = computed(() => versions.value[0]?.version ?? null)
  const shownVersion = computed(() => toValue(requestedVersion) ?? currentVersion.value)

  const { data: terms, status, error } = useAsyncData(
    () => `membership-terms-${shownVersion.value ?? 'pending'}`,
    () => (shownVersion.value ? termsRepository.getMembershipTerms(shownVersion.value) : Promise.resolve(null)),
    { default: () => null }
  )

  const previousVersion = computed(() => {
    const shownIndex = versions.value.findIndex(entry => entry.version === shownVersion.value)
    return shownIndex === -1 ? null : versions.value[shownIndex + 1] ?? null
  })

  return {
    terms,
    versions,
    currentVersion,
    previousVersion,
    isCurrent: computed(() => shownVersion.value !== null && shownVersion.value === currentVersion.value),
    isLoading: computed(() => status.value === 'pending'),
    error
  }
}
