# YoyoPet member app: UI conventions


- **Stack:** Nuxt 4 (`app/` dir), Tailwind CSS v4 via `@tailwindcss/vite`, `@nuxt/icon` (Lucide, server-bundled), `@nuxt/image`, `@nuxt/fonts` (self-hosted Google fonts, see Design system).
- **Package manager:** `bun`.
- **TypeScript is pinned to `~5.9`.** TS 7 breaks `vue-tsc` and `typescript-eslint`, so don't upgrade it until both support it.
- **Components:** `pathPrefix: false`, so they're referenced by file name (`<AppNavbar />`). Layout chrome goes in `app/components/layout/`, reusable primitives in `app/components/ui/`, and shared composites in `app/components/common/`.
- **Design tokens** live in `app/assets/css/main.css` under `@theme`. See **Design system** below. Never use raw hex values or Tailwind default colors.
- **Page gutters:** wrap every section's content in `page-container` (120px each side from `xl` up, smaller below). Don't hardcode horizontal padding or `max-w-*` for page width.
- **Designs are drawn at 1920px wide.** From `xl` (1280px) up, the root font-size scales from 14px to 16px with the viewport (`main.css`), so **Tailwind units = design px ÷ 4** and the layout is exact at 1920 and proportional below it. For example, design 56px text → `xl:text-[3.5rem]` and design 54px box → `xl:size-13.5`. Never use raw `px` for sizes that should scale.
- **Measure, don't trust the spec sheet's size ranges.** The design's real text is larger than the font table suggests: body text is usually 18px (`xl:text-lg`), the page title 56px, and card titles 30px.
- **Write mobile-first:** use the base classes for mobile, then `xl:` for the design sizes. Below `xl`, multi-column sections stack.
- **The navbar is the exception.** `AppNavbar.vue` uses its own `clamp()` CSS variables in px, so it's unaffected by the root scaling. Leave it as is unless you're refactoring it on purpose.
- **Feature components go in a folder named for the page,** e.g. `app/components/home/` (`MemberOverview`, `PointsCard`, `OrderEntryCard`, `PendingOrdersBanner`, `QuickActions`, `PromoBannerCarousel`, `RecommendedRewards`, `TopSpenderAndTier` → `TopSpenderCard` + `MemberTierCard`, `PetsAndReferral` → `MyPetsCard` + `PetBirthdayCard` + `ReferralCard`, `PointsAndCoupons` → `RecentPointsCard` + `MyCouponsCard`, `ShopOnMarketplaces`). Components reused across pages (e.g. `RewardCard`, `CouponArtwork`, `CouponTicket`) go in `app/components/common/`. Layout chrome is `AppNavbar` (with `NotificationBell` and `ProfileMenu`, both built on `usePopover()` for outside-click/Esc/route-change closing) + `AppFooter`; their link lists come from `app/utils/navigation.ts` (`mainNavItems`, `helpNavItems`), so edit links there once.
- **Static site settings live in `app/app.config.ts`** (marketplace store URLs and logos, social links). Read them with `useAppConfig()`. They are not member data, so they don't go through a repository.
- **Formatting helpers live in `app/utils/format.ts`** (`formatNumber`, `formatThaiShortDate`). Dates show the Gregorian year (2026), not the Buddhist year.
- **Content images via `NuxtImg`:** pass the source image's real aspect ratio in `width`/`height` and crop with CSS (`object-cover object-*`). If `width`/`height` don't match the source ratio, ipx center-crops on the server and CSS `object-position` stops working.
- **Icons:** `@nuxt/icon` is set to `cssLayer: 'base'` so Tailwind `size-*` classes can size icons. Without it, icons get stuck at 1em.
- **Language:** UI copy is Thai and `<html lang="th">`. Code identifiers are English.
- **Comments:** don't write comments that restate the code. Only explain non-obvious reasons (workarounds, API limits, business rules).

