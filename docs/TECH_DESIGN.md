# Technical Design

## 1. Tech Stack

AI-TRPG Collaboration Platform uses the following MVP stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and database access
- PostgreSQL on Supabase
- AI API integration for Session summaries
- Vercel deployment

The current Next.js version is `16.2.6`. Next.js-specific implementation should follow the local docs in `node_modules/next/dist/docs/`, especially for App Router, Server Components, Route Handlers, Server Actions, and async request APIs such as `cookies()`.

## 2. Directory Structure Conventions

Current conventions:

- `src/app`: route segments and page entry points only.
- `src/components/common`: shared presentational components.
- `src/components/campaign`: Campaign UI components.
- `src/components/character`: Character UI components.
- `src/components/session`: Session UI components.
- `src/components/ai`: AI-related UI components.
- `src/lib/supabase`: Supabase client factories.
- `src/lib/auth`: future authentication helpers and authorization checks.
- `src/lib/db`: future data access layer functions.
- `src/lib/ai`: future AI provider and prompt helpers.
- `src/types`: shared TypeScript types.
- `src/utils`: small framework-agnostic utilities.

Business logic should not live directly in `src/app` pages. Pages should call server-side helpers, data access functions, or feature modules.

## 3. Supabase Client Layers

Supabase client creation is split by runtime:

- `src/lib/supabase/browser.ts`
  - Creates a browser client with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Intended for client components that need Supabase session-aware browser behavior.
  - Must never read `SUPABASE_SERVICE_ROLE_KEY`.

- `src/lib/supabase/server.ts`
  - Creates a server client with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Uses Next.js 16 compatible async `cookies()` from `next/headers`.
  - Intended for Server Components, Server Actions, and Route Handlers that need user-scoped Supabase access.
  - Uses the anon key so Row Level Security can remain the primary database permission boundary once policies are added.

The service role key is not used by either client. If future admin-only operations require it, they must be isolated in server-only code and never imported by client components.

## 4. Environment Variables

Required local variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Rules:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is private and must only be read by trusted server-only code.
- `OPENAI_API_KEY` is private and must only be read by server-side AI integration code.
- `.env.local` must not be committed.

## 5. Security Rules

- Do not hard-code API keys.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser bundles.
- Do not call AI APIs from the browser.
- Do not rely on hidden buttons as the only authorization layer.
- Private Campaign reads and writes must verify both the current user and Campaign membership.
- GM-only actions, such as Session management and AI summary generation, must be checked on the server.
- RLS policies should be added before real user data is trusted in Supabase.

## 6. MVP Development Order

Recommended order:

1. Auth foundation
   - Supabase Auth wiring.
   - Profile creation flow.
   - Login/logout actions.

2. Campaign foundation
   - Dashboard data loading.
   - Campaign create/list/detail.
   - Membership checks.

3. Character management
   - Character list and create/edit flow.
   - Player-owned edit checks.
   - GM read access.

4. Session management
   - Session list/detail.
   - Raw Session log save/edit.
   - GM-only mutation checks.

5. AI Summary
   - Server-side AI provider wrapper.
   - Prompt template for structured Session summaries.
   - Save summary to `sessions.summary`.
   - Save generation history to `ai_outputs`.

6. Deployment
   - Vercel environment variables.
   - Supabase project configuration.
   - Final lint/build verification.
