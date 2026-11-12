export interface CampaignProduct {
  id: string
  name: string
  imageUrl: string | null
  badge: string | null
  shopUrl: string
}

export interface Campaign {
  id: string
  title: string
  tagline: string
  bannerImageUrl: string
  startsOn: string
  endsOn: string
  highlights: string[]
  products: CampaignProduct[]
}
