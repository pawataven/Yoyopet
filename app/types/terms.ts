export type MembershipTermsTopic = 'points' | 'redemption' | 'coupons' | 'tiers'

export interface MembershipTermsSection {
  id: string
  // Sections without a topic still render; they just have no tab of their own
  topic: MembershipTermsTopic | null
  title: string
  terms: string[]
}

export interface MembershipTermsVersion {
  version: string
  effectiveAt: string
}

export interface MembershipTermsDocument extends MembershipTermsVersion {
  // Shown with a notice until the store supplies the final legal wording
  isSampleText: boolean
  sections: MembershipTermsSection[]
}
