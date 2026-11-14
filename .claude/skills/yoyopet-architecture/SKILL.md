---
name: yoyopet-architecture
description: YoyoPet code-placement and data-layer rules (member app vs admin app vs Supabase, repositories, RLS, keys). Read before adding a page, repository, composable, auth, or Supabase code, or an admin feature. Not needed for copy, styling, or single-component tweaks.
---

# YoyoPet architecture

Loyalty program: members earn points from Shopee / TikTok Shop / Lazada orders, redeem rewards, and hold coupons.

## Where code belongs

| Folder | Role |
|---|---|
| `Yoyopet-frontend/` | Member app: Nuxt 4, mobile-first, branded, no component library |
| `YoyoPets-Backend/` | Admin (staff) app: Nuxt 4 + Nuxt UI, desktop-first. Despite the name it is a web app, not the backend |
| `supabase/` (repo root) | Migrations, RLS policies, DB functions, Edge Functions. One copy only |

- The two apps never call each other. Both talk to Supabase directly.
- `shared/types/database.types.ts` in each app is generated (`bun run types:supabase`). Never hand-edit it once the real schema exists.

## Rules

- **Business rules that change points, coupons, or money live only in a Postgres function or Edge Function.** Neither app re-implements them.
- Only the publishable key reaches the browser. Secret and service-role keys live only in Edge Functions or `server/` code.
- Every table an app reads has RLS. Members see `member_id = auth.uid()` rows; admin access comes from `(select private.is_admin())` / `private.is_super_admin()` (active row in `admin_users` + TOTP `aal2`), not a JWT claim. Frontend role checks are UX only.
- The admin app is deployed separately and access-restricted (IP allowlist, VPN, or SSO).

## Data layers (both apps)

`component → composable (useX) → repository interface → mock | supabase implementation`

- `app/types/*.ts`: camelCase UI types. A Supabase implementation maps snake_case rows to them.
- `app/repositories/<entity>.repository.ts`: `<Entity>Repository` interface + `createMock<Entity>Repository()`.
- `app/repositories/index.ts`: `useRepositories()` is the single mock/real switch. Swap one repository at a time.
- `app/composables/use<Entity>.ts` wraps the repository in `useAsyncData`. Components use composables only, never repositories or Supabase.
- `useAuth()` is still a mock. Protected pages use `definePageMeta({ middleware: 'auth' })`.

## Supabase status

`@nuxtjs/supabase` is installed in both apps with `redirect: false`; every repository is still mock. Dev runs against a Supabase Cloud project: schema changes go in `supabase/migrations/` and `bunx supabase db push`, never Dashboard-only edits. Remaining steps: `Yoyopet-frontend/README.md` → "Connecting Supabase".

## Toolchain

bun. TypeScript is pinned to `~5.9` (TS 7 breaks `vue-tsc` and `typescript-eslint`). Before finishing, run `bun run lint`, `bun run typecheck`, `bun run build` in the app you changed.

## Read only when the task needs it

- Member-app UI work (layout, sizing, component folders, images, icons): [member-ui.md](member-ui.md)
- Colors, fonts, typography rules: [design-system.md](design-system.md)
