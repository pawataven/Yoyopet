export default defineAppConfig({
  // TODO: replace with the real YoYo Pet store URLs on each marketplace
  marketplaceStores: [
    { id: 'shopee', name: 'Shopee', logoUrl: '/marketplaces/shopee.png', storeUrl: 'https://shopee.co.th/', storeName: 'yoyopet Official Store' },
    { id: 'tiktok-shop', name: 'TikTok Shop', logoUrl: '/marketplaces/tiktok-shop.png', storeUrl: 'https://www.tiktok.com/', storeName: 'yoyopet Official Store' },
    { id: 'lazada', name: 'Lazada', logoUrl: '/marketplaces/lazada.png', storeUrl: 'https://www.lazada.co.th/', storeName: 'yoyopet Official Store' }
  ],
  // TODO: confirm the LINE OA chat link and support hours
  supportChat: {
    lineId: '@yoyopet',
    url: 'https://line.me/R/ti/p/@yoyopet',
    hours: 'ตอบทุกวัน 09:00–18:00 น.'
  },
  // TODO: confirm the real social account URLs
  socialLinks: [
    { label: 'Facebook: YoYo Pet Shop', url: 'https://www.facebook.com/' },
    { label: 'IG / TikTok: yoyopet.official', url: 'https://www.instagram.com/yoyopet.official' },
    { label: 'LINE: @yoyopet', url: 'https://line.me/R/ti/p/@yoyopet' }
  ]
})
