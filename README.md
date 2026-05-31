# AI-TRPG Collaboration Platform

## Project Overview

AI-TRPG Collaboration Platform is an AI-assisted collaboration platform for TRPG game masters and players.

The MVP focuses on a practical campaign workspace: Campaign management, character sheets, Session logs, and AI-generated Session summaries. It is designed to reduce the manual work of organizing long-running tabletop role-playing campaigns while keeping GM / Player collaboration boundaries clear.

## MVP Features

- Supabase Auth registration, login, and logout
- Protected Dashboard
- Campaign creation and management
- Campaign internal navigation
- Character sheet management
- Session creation and `raw_log` recording
- DeepSeek AI Session Summary
- AI output persistence to `sessions.summary` and `ai_outputs`
- Basic GM / Player permission control

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security
- DeepSeek OpenAI-compatible API
- Vercel-ready deployment

## MVP User Flow

```text
Register / Login
-> Create Campaign
-> Add Character
-> Create Session
-> Write Raw Log
-> Generate AI Summary
```

## Project Structure

- `src/app`: App Router routes, pages, route handlers, and server actions
- `src/components`: UI components grouped by domain
- `src/lib`: Supabase clients, auth helpers, data access helpers, and AI utilities
- `docs`: Product, technical, and database design documents
- `supabase/schema.sql`: Supabase-compatible PostgreSQL schema, triggers, indexes, and RLS policies

## Environment Variables

Create a local `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

Do not commit `.env.local`. Do not create or use `NEXT_PUBLIC_DEEPSEEK_API_KEY`; the DeepSeek API key must only be read on the server.

## Local Development

```bash
npm install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

On Windows PowerShell, if script execution policy blocks `npm.ps1`, use `npm.cmd` as shown above.

## Database Setup

Create a Supabase project, then run the SQL in [`supabase/schema.sql`](./supabase/schema.sql) from the Supabase SQL Editor.

The schema includes MVP tables, profile auto-creation trigger, indexes, and initial Row Level Security policies.

## Documentation

- [PRD](./docs/PRD.md)
- [Technical Design](./docs/TECH_DESIGN.md)
- [Database Design](./docs/DATABASE_DESIGN.md)
- [Agent Rules](./AGENTS.md)

## Current Status

MVP implemented. Pending manual end-to-end validation, UI polish, screenshots, and deployment.

## Roadmap

- Campaign layout refactor
- User testing
- AI NPC generation
- Invite links
- Deployment to Vercel
- Screenshots and demo video
