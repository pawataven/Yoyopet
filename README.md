# YoyoPet

Member and loyalty-points web app for YoyoPet, built with Nuxt 4 and Tailwind CSS v4.

## Backend status

The backend (Supabase, running separately) is **not connected yet**. Every screen runs on mock data from `app/repositories`. The structure is ready, so connecting it later won't require changes to components.

## Data access

| Layer | Location | Role |
|---|---|---|
| Frontend types | `app/types/*.ts` | Data shapes the UI uses (camelCase) |
| Repository | `app/repositories/*.repository.ts` | An interface plus implementations: mock now, Supabase later |
| Switch point | `app/repositories/index.ts` | Chooses which implementation to use, in one place |
| Composable | `app/composables/use*.ts` | Wraps a repository in `useAsyncData` (SSR + cache) for components |
| Database types | `shared/types/database.types.ts` | Placeholder. Regenerate from the real schema when connecting |

Components only call composables such as `useMember()`. They never call a repository or the backend directly.

## Connecting Supabase (later)

1. ~~Install `@nuxtjs/supabase`~~ done: the module is in `nuxt.config.ts` with `redirect: false` until step 5
2. Fill in `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_KEY` in `.env`
3. `bun run types:supabase` to generate types from the real database
4. Write `createSupabaseMemberRepository()` that implements `MemberRepository`, and swap it in at `app/repositories/index.ts`
5. Change `useAuth()` to read the real session with `useSupabaseUser()`
6. Turn on Row Level Security for every table the frontend reads, because the publishable key is visible in the browser

## Setup

```bash
bun install
bun run dev   # http://localhost:3000
```

## Protecting pages that require login

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

## Production

```bash
bun run lint
bun run typecheck
bun run build
node .output/server/index.mjs
```

Build on the same OS and architecture you deploy to, because `@nuxt/image` bundles the `sharp` binary.
