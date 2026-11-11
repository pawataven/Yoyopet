export default defineAppConfig({
  // TODO: replace with the real YoYo Pet store URLs on each marketplace
  marketplaceStores: [
    { id: 'shopee', name: 'Shopee', logoUrl: '/marketplaces/shopee.svg', storeUrl: 'https://shopee.co.th/' },
    { id: 'tiktok-shop', name: 'TikTok Shop', logoUrl: '/marketplaces/tiktok-shop.svg', storeUrl: 'https://www.tiktok.com/' },
    { id: 'lazada', name: 'Lazada', logoUrl: '/marketplaces/lazada.png', storeUrl: 'https://www.lazada.co.th/' }
  ],
  // TODO: confirm the real social account URLs
  socialLinks: [
    { label: 'Facebook: YoYo Pet Shop', url: 'https://www.facebook.com/' },
    { label: 'IG / TikTok: yoyopet.official', url: 'https://www.instagram.com/yoyopet.official' },
    { label: 'LINE: @yoyopet', url: 'https://line.me/R/ti/p/@yoyopet' }
  ]
})
