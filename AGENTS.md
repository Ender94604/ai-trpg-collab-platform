# Project Overview

AI-TRPG Collaboration Platform is an AI-assisted collaboration platform for TRPG game masters and players.

The product helps groups manage campaigns, character sheets, session logs, and AI-generated recaps in one lightweight web workspace.

# MVP Scope

The MVP loop is:

```text
Auth -> Campaign -> Character -> Session -> AI Summary
```

Prioritize completing and preserving this end-to-end workflow before adding secondary features.

# Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- AI API integration
- Vercel

# Architecture Rules

- `src/app` should only own routing and page entry points.
- Business logic should live in `src/lib`, `src/features`, or another agreed business-module directory.
- Keep authorization checks close to the data access layer or server-side logic.
- Do not rely only on hiding frontend buttons for permission control.
- Campaign is the core business object. Character, Session, and AIOutput should all be modeled around Campaign.

# Security Rules

- Do not hard-code API keys in source code.
- Do not commit `.env.local`.
- AI API keys must only be read on the server.
- Supabase service role keys must never be exposed to the frontend.
- All private Campaign data access must verify both user identity and Campaign membership/role permissions.

# Coding Rules

- All new code must use TypeScript.
- Keep changes small and focused.
- Do not implement multiple large modules in a single task.
- Do not implement features explicitly excluded by the PRD, including community, voice, maps, payments, or a full rules engine.
- After completing a task, run `npm run lint`.
- If the change may affect build behavior, also run `npm run build`.
- This project uses a newer Next.js version with breaking changes. Before writing Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

# Reporting Rules

After each task, report:

- Which files changed.
- What was implemented.
- How it was verified locally.
- Whether anything remains unfinished.
- Any potential risks.
