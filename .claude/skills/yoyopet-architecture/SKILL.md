---
name: yoyopet-architecture
description: YoyoPet system architecture and project conventions. Read before adding features, pages, data access, auth, or backend/Supabase integration; before creating or changing the admin (back-office) app; before moving files between apps/packages; or when unsure where code belongs (member app vs admin app vs Supabase).
---

# YoyoPet architecture

YoyoPet is a pet-brand loyalty program: members collect points from orders (Shopee, TikTok Shop, Lazada), redeem rewards, and hold coupons.

## System shape (decided)

```
member web (this app)  ──┐
                         ├──▶  Supabase (Postgres + Auth + Edge Functions)  ← runs separately
admin web (back-office) ─┘
```

- **Two separate web apps, one shared Supabase backend.** Both apps talk to Supabase directly.
- **The member app never calls the admin app**, and the reverse is also true. The admin app is a tool for staff, not an API for the member app.
- **Supabase runs separately** (Cloud or self-hosted). Neither web app hosts the database.

## Where code belongs

| Concern | Location |
|---|---|
| Member-facing UI (mobile-first, branded) | `apps/member` |
| Staff UI (tables, forms, desktop-first) | `apps/admin` |
| Database types, domain types, shared pure utils | `packages/shared` |
| Schema, migrations, RLS policies, DB functions, Edge Functions | `supabase/` (or a separate backend repo) |
| **Business rules that change points, coupons, or money** (e.g. award points from an order number, redeem a reward) | **Supabase Edge Function or Postgres function only**, never in either web app, so both apps share one source of truth |

## Target repo layout (bun workspaces)

```
yoyopet/
  apps/
    member/
    admin/
  packages/
    shared/
  supabase/
```

**Current state:** the repo is still a single Nuxt app at the root (it will become `apps/member`). Until the move happens, treat the root as `apps/member` and `shared/types/` as the future `packages/shared`. Don't create the admin app inside the member app's `app/` directory.

## Security rules

- Only the **publishable/anon key** may reach the browser. Secret/service-role keys live only in server code (`server/api/*`, Edge Functions) and in the deployment environment.
- **Every table either app reads must have Row Level Security.** Members see only their own rows (`member_id = auth.uid()`). Admin access is granted by an `admin` role claim in the JWT, never by a check in the frontend alone.
- The admin app is deployed separately and should be access-restricted (IP allowlist, VPN, or SSO).
- Frontend role checks are for UX only. The real enforcement is RLS or server-side checks.

## Backend connection status

**Not connected yet, on purpose.** The member app runs on mock data. Don't add Supabase calls or install `@nuxtjs/supabase` unless the user explicitly asks to connect the backend.

When connecting is requested, follow the steps in `README.md` under "Connecting Supabase (later)": install the module, generate types, implement `create<Supabase>…Repository()`, swap it in `app/repositories/index.ts`, and make `useAuth()` read the real session.

## Data access layers (member app; mirror this in admin)

```
component → composable (useX) → repository interface → implementation (mock | supabase)
```

- `app/types/*.ts`: UI-facing types in camelCase.
- `app/repositories/<entity>.repository.ts`: an `<Entity>Repository` interface plus `createMock<Entity>Repository()`. A Supabase implementation maps snake_case rows to the UI types here.
- `app/repositories/index.ts`: `useRepositories()` is the **single switch point** between mock and real.
- `app/composables/use<Entity>.ts`: wraps the repository in `useAsyncData` (SSR + dedupe). **Components only use composables**; they never import repositories or Supabase directly.
- `app/composables/useAuth.ts`: currently a mock (`userId` state). Pages that need login use `definePageMeta({ middleware: 'auth' })`.
- `shared/types/database.types.ts`: a placeholder. Regenerate it with `bun run types:supabase` and never hand-edit it after the backend exists.

## Member app conventions

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

## Design system

Tailwind's default palette is disabled (`--color-*: initial`), so classes like `text-gray-500` or `bg-red-500` won't generate. Use only these tokens:

| Token | Hex | Thai name | Use |
|---|---|---|---|
| `primary` | `#ED492E` | แดงหลัก | Brand, navbar, primary CTA. Also the logo background, so keep them identical |
| `primary-dark` | `#C93A22` | แดงเข้ม | Hover or pressed state on primary, emphasis |
| `primary-soft` | `#FDE8E3` | ชมพูอ่อน | Soft badges, icon tiles, hover on white buttons |
| `cream` | `#FFF8F5` | ครีม | Soft section and card backgrounds |
| `ink` | `#2A1D1A` | ตัวอักษร | Default text |
| `cocoa` | `#2C1F1D` | น้ำตาลเข้ม | Dark surfaces (e.g. the dark order-entry card) |
| `muted` | `#6E5A55` | ข้อความรอง | Secondary text, captions |
| `border` | `#EFE2DE` | เส้น | Borders and dividers (also the default `border` color) |
| `success` | `#2F7A3A` | สำเร็จ | Success states |
| `pending` | `#8A5A00` | รอ | Pending or awaiting states |
| `gold` | `#FFD43B` | ทอง | Points star, notification dot, highlights |
| `line-green` | `#06C755` | LINE | LINE brand only (connect or log in with LINE) |
| `medal-gold` / `medal-silver` / `medal-bronze` | `#F2B705` / `#AEB8C2` / `#D08A4C` | เหรียญ | Leaderboard rank 1–3 badges only |
| `white` | `#FFFFFF` | | Surfaces. On `primary`, translucent white (`bg-white/15`, hover `/25`) gives the navbar pills and bell their lighter red. Don't add a separate color for it |

Fonts (loaded in `nuxt.config.ts` under `fonts.families`):

| Class | Font | Use | Weight · size |
|---|---|---|---|
| `font-heading` | Mitr | Headings, important buttons | Medium 500 · 18–26px |
| `font-sans` (default) | Anuphan | Body text, labels, buttons | 400–600 · 11–16px |
| `font-number` | Fredoka | Point numbers and codes (`1,280`, `YY-204518`) | Semibold 600 · 13–44px |

- `h1`–`h6` get `font-heading font-medium` by default in the base layer.
- **Mitr's digit 0 looks wrong.** Headings that contain digits must use Anuphan 600 instead: `class="font-sans font-semibold"`.
- **Fredoka has no `฿` and no Thai glyphs.** Write "บาท" instead of `฿`. Wrap only the number in `font-number` and keep units like "แต้ม" outside that span.
- Only the weights listed above are loaded. Don't use `font-bold`, `font-extrabold`, or any other unlisted weight, because the browser would fake it.

## Admin app guidance (when it's created)

- Use Nuxt 4 with the same toolchain, so `packages/shared` types and utils work in both apps. A component library such as Nuxt UI is fine here, but keep it out of the member app.
- Use the same layering (types → repository → composable) and the same mock-first approach until the backend is connected.
- Every write that touches points, coupons, or orders calls the Edge Function or DB function for it. Don't re-implement the rule in the admin UI.

## Before finishing any change

```bash
bun run lint
bun run typecheck
bun run build
```
