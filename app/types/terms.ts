export type MembershipTermsTopic = 'points' | 'redemption' | 'coupons' | 'tiers'

export interface MembershipTermsSection {
  id: string
  // Each tab shows only the sections of its topic
  topic: MembershipTermsTopic
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
