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
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

Rules:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is private and must only be read by trusted server-only code.
- The current MVP AI provider is DeepSeek, called through its OpenAI-compatible Chat Completions API.
- `DEEPSEEK_API_KEY` is private and must only be read by server-side AI integration code.
- `DEEPSEEK_BASE_URL` defaults to `https://api.deepseek.com`.
- `DEEPSEEK_MODEL` defaults to `deepseek-v4-flash`; do not use deprecated DeepSeek model aliases as defaults.
- `OPENAI_API_KEY` may exist for older local setups, but the current implementation does not use it.
- `.env.local` must not be committed.

## 5. Security Rules

- Do not hard-code API keys.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser bundles.
- Do not call AI APIs from the browser.
- Do not expose `DEEPSEEK_API_KEY` or any AI provider key to browser bundles.
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
   - GM-only Session prep notes save/edit.
   - Session transcript save/edit for actual play records.
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

## 7. AI Summary Data Flow

The MVP AI Summary flow is:

```text
GM clicks Generate Summary
-> client calls POST /api/ai/summarize
-> route handler verifies authenticated user
-> route handler verifies Campaign role is gm
-> server reads Campaign, Characters, and Session transcript
-> server builds prompt
-> server calls DeepSeek Chat Completions with response_format json_object
-> server normalizes JSON summary
-> server updates sessions.summary
-> server inserts ai_outputs row with type = session_summary
-> client renders structured summary
```

Only the internal route handler calls DeepSeek. The browser never receives the DeepSeek API key.

Session text fields have distinct product meanings:

- `gm_notes`: GM-only Session Prep notes. These are private to GMs and are not a factual source for AI summaries.
- `transcript`: the actual Session record. In the MVP, the GM manually pastes this text. In a future version, it may be generated from voice transcription.
- `raw_log`: legacy field retained for existing data. New code should not use it as the primary AI Summary input.

Players can view saved AI summaries but should not receive GM notes, transcripts, or legacy raw logs from server-side data access. Voice platforms, live audio, and speech-to-text are future directions and are not implemented in this MVP change.

## 8. Password Reset Flow

Password reset is handled through Supabase Auth without using the service role key.

The MVP flow is:

```text
User clicks Forgot password on /login
-> user submits email on /reset-password
-> server action calls supabase.auth.resetPasswordForEmail
-> Supabase sends a recovery email
-> custom Reset Password email link returns to /auth/confirm with token_hash and type=recovery
-> /auth/confirm calls verifyOtp({ token_hash, type: "recovery" }) with the server Supabase client
-> /auth/confirm writes auth cookies and redirects to /update-password
-> /update-password checks the current Supabase user/session
-> server action calls supabase.auth.updateUser({ password })
-> server action signs out and asks the user to log in again
```

The reset request form applies a short client-side cooldown after submission and uses a neutral success message so repeated clicks do not quickly hit Supabase rate limits and the UI does not reveal whether an email address exists.

The current recommended password reset flow uses `/auth/confirm` and Supabase's `token_hash` email template variable instead of the default `{{ .ConfirmationURL }}`. This avoids relying on fragile client-side token parsing or PKCE code exchange in the reset page.

Supabase Dashboard Reset Password Email Template should use this link:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/update-password
```

Do not use the default `{{ .ConfirmationURL }}` for the current password reset flow.

The `/auth/confirm` route only supports `type=recovery` for the MVP. It verifies the `token_hash` with `verifyOtp`, rejects missing tokens and unsupported types, and only redirects to safe site-relative `next` paths.

The existing `/auth/callback` route remains available for older OAuth or code-exchange compatible links. Password reset should prefer `/auth/confirm`.

Password reset origins must not be hard-coded to localhost in deployed environments. Local development should resolve to `http://localhost:3000`, while production should resolve to the Netlify site origin.

Supabase Auth URL Configuration should include:

- Site URL: `https://royce-ai-trpg-platform.netlify.app`
- Redirect URLs:
  - `https://royce-ai-trpg-platform.netlify.app/**`
  - `http://localhost:3000/**`

The reset flow must not expose any private keys. Server-side reset-link requests and password updates use the user-scoped Supabase client. No service role key is involved.

## 9. Invite Link / Join Campaign Flow

Campaigns remain private by default. The project does not use public Campaign search or discovery. Players join a Campaign through a tokenized invite link created by a GM.

The MVP invite flow is:

```text
GM opens /campaigns/[id]/settings
-> server verifies the current user is a Campaign member and reads their role
-> GM creates an invite link
-> server action verifies role = gm
-> server inserts campaign_invites with a random token
-> Settings displays /join/[token] as a full localhost or Netlify URL
-> player logs in or registers
-> player opens /join/[token]
-> server calls get_campaign_invite(token) RPC for minimal Campaign details
-> player clicks Join Campaign
-> server action calls join_campaign_by_invite(token) RPC
-> RPC validates auth.uid(), token validity, expiration, and existing membership
-> RPC inserts campaign_members role = player when needed
-> player is redirected to /campaigns/[id]
```

Invite tokens are treated as secrets. The database does not expose broad direct SELECT access for all active invites. Instead:

- GMs can directly view and create invite rows for Campaigns where they are GM.
- `get_campaign_invite(invite_token)` is a security definer RPC that returns only minimal join-page data for a valid token.
- `join_campaign_by_invite(invite_token)` is a security definer RPC that performs the membership insert after validating the token and current user.

The application must not use the Supabase service role key for invite creation or joining. All calls use the normal server Supabase client with the current user session. MVP does not implement invite revoke/delete or public Campaign discovery.
