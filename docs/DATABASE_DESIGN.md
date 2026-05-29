# Database Design

## 1. Database Design Goals

The MVP database is designed around the core workflow:

```text
Auth -> Campaign -> Character -> Session -> AI Summary
```

The database should:

- Keep Campaign as the primary business container.
- Support Supabase Auth users through a `profiles` table linked to `auth.users`.
- Store membership and role information for each Campaign.
- Persist player character sheets, Session logs, AI summaries, and AI output history.
- Keep permissions enforceable at the database and server layer.
- Stay small enough for the MVP while leaving clear extension points for NPCs, invites, audit logs, and richer collaboration features.

## 2. Core Business Objects

### Profile

`profiles` stores application-level user profile data for authenticated Supabase users. Authentication itself remains owned by Supabase Auth.

### Campaign

`campaigns` is the central business object. A Campaign is a TRPG workspace created by a GM. Characters, Sessions, AI outputs, and membership records all belong to a Campaign.

### Campaign Member

`campaign_members` links users to Campaigns and stores their role. MVP roles are `gm` and `player`.

### Character

`characters` stores a player's character sheet within a Campaign. A character belongs to both a Campaign and a user.

### Session

`sessions` stores a single TRPG session record, including the raw session log and the saved AI summary. The summary is stored as `jsonb` so structured AI output can evolve without immediate schema churn.

### AI Output

`ai_outputs` stores generated AI content for traceability and later evaluation. For P0, it mainly records AI summary generation tied to Campaigns and optionally Sessions.

## 3. ER Relationships

```text
auth.users 1 -- 1 profiles
profiles 1 -- many campaigns.owner_id
profiles 1 -- many campaign_members.user_id
profiles 1 -- many characters.user_id
profiles 1 -- many sessions.created_by
profiles 1 -- many ai_outputs.created_by

campaigns 1 -- many campaign_members
campaigns 1 -- many characters
campaigns 1 -- many sessions
campaigns 1 -- many ai_outputs

sessions 1 -- many ai_outputs
```

Deleting a Campaign cascades to `campaign_members`, `characters`, `sessions`, and `ai_outputs`.

## 4. Table Designs

## 4.1 profiles

Purpose: Stores user display data for application features.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. References `auth.users(id)` with cascade delete. |
| email | text | User email copied from auth metadata when available. |
| display_name | text | Optional public display name. |
| avatar_url | text | Optional avatar URL. |
| created_at | timestamptz | Creation timestamp. |
| updated_at | timestamptz | Update timestamp. |

## 4.2 campaigns

Purpose: Stores Campaign workspaces.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. Defaults to `gen_random_uuid()`. |
| title | text | Required Campaign title. |
| description | text | Optional short description. |
| system_type | text | Optional rules system, such as COC, DND, or original. |
| world_setting | text | Optional Campaign world setting. |
| visibility | text | `private` or `invite_only`. Defaults to `private`. |
| owner_id | uuid | Required creator profile ID. |
| created_at | timestamptz | Creation timestamp. |
| updated_at | timestamptz | Update timestamp. |

## 4.3 campaign_members

Purpose: Stores Campaign membership and role.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. Defaults to `gen_random_uuid()`. |
| campaign_id | uuid | Required Campaign ID. Cascades on Campaign delete. |
| user_id | uuid | Required profile ID. Cascades on profile delete. |
| role | text | Required. Allowed values: `gm`, `player`. |
| created_at | timestamptz | Membership creation timestamp. |

Notes:

- A unique constraint on `(campaign_id, user_id)` prevents duplicate membership.
- The Campaign owner should also have a `gm` row in this table.

## 4.4 characters

Purpose: Stores generic MVP character sheets.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. Defaults to `gen_random_uuid()`. |
| campaign_id | uuid | Required Campaign ID. Cascades on Campaign delete. |
| user_id | uuid | Required owning profile ID. Cascades on profile delete. |
| name | text | Required character name. |
| occupation | text | Optional occupation or identity. |
| background | text | Optional background story. |
| personality | text | Optional personality notes. |
| stats | jsonb | Optional flexible ability/status data. Defaults to `{}`. |
| inventory | jsonb | Optional flexible inventory data. Defaults to `{}`. |
| notes | text | Optional free-form notes. |
| created_at | timestamptz | Creation timestamp. |
| updated_at | timestamptz | Update timestamp. |

## 4.5 sessions

Purpose: Stores Session records and saved AI summaries.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. Defaults to `gen_random_uuid()`. |
| campaign_id | uuid | Required Campaign ID. Cascades on Campaign delete. |
| title | text | Required Session title. |
| session_date | date | Optional in-game or real session date. |
| raw_log | text | Raw Session log. Defaults to empty text. |
| summary | jsonb | Optional saved AI summary. |
| created_by | uuid | Required creator profile ID. |
| created_at | timestamptz | Creation timestamp. |
| updated_at | timestamptz | Update timestamp. |

## 4.6 ai_outputs

Purpose: Stores AI generation history for summaries and future AI features.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. Defaults to `gen_random_uuid()`. |
| campaign_id | uuid | Required Campaign ID. Cascades on Campaign delete. |
| session_id | uuid | Optional Session ID. Set to null if the Session is deleted independently. |
| type | text | Required output type, such as `session_summary`. |
| prompt | text | Required prompt sent to the AI provider. |
| output | jsonb | Required structured AI output. |
| created_by | uuid | Required creator profile ID. |
| created_at | timestamptz | Creation timestamp. |

## 5. Permission Model

MVP permissions are based on Campaign membership:

- Unauthenticated users cannot access private Campaign data.
- A Campaign owner is a GM.
- `campaign_members.role = 'gm'` can manage Campaign data, Sessions, and AI generation.
- `campaign_members.role = 'player'` can view Campaign content exposed to members and manage their own Characters.
- Non-members cannot read or mutate private Campaign data.

Server actions, route handlers, and data access functions must verify the current user and Campaign membership before returning or mutating private data.

## 6. Index Design

The schema adds indexes for common MVP access patterns:

- Campaign lists by owner: `campaigns(owner_id)`.
- Campaign membership lookup: `campaign_members(user_id)`, `campaign_members(campaign_id)`.
- Character lists per Campaign and user: `characters(campaign_id)`, `characters(user_id)`.
- Session lists per Campaign and creator: `sessions(campaign_id)`, `sessions(created_by)`.
- AI output history per Campaign, Session, and creator: `ai_outputs(campaign_id)`, `ai_outputs(session_id)`, `ai_outputs(created_by)`.

The unique index on `campaign_members(campaign_id, user_id)` prevents duplicate membership records.

## 7. RLS Design Plan

The initial `schema.sql` creates tables, constraints, foreign keys, and indexes, but intentionally does not include complex RLS policies.

Planned RLS approach:

- Enable RLS on all application tables.
- `profiles`: users can read limited profile fields for Campaign members and update only their own profile.
- `campaigns`: members can read their Campaigns; only GMs can update or delete.
- `campaign_members`: members can read membership in their Campaigns; only GMs can invite or change roles.
- `characters`: Campaign members can read characters; users can mutate their own characters; GMs may get elevated edit permissions in a later version.
- `sessions`: Campaign members can read saved summaries; only GMs can create or edit raw logs and summaries.
- `ai_outputs`: only GMs can create AI outputs; members can read only outputs intended for shared Campaign history.

Until RLS is implemented, application code must treat all private data access as server-only and enforce membership checks in the data access layer.

## 8. Tables Deferred From MVP P0

### npcs

Deferred because AI NPC generation is P1 in the PRD. The MVP P0 validation focuses on AI Session summaries.

### invites

Deferred because invitation links are P1. During P0, membership can be created manually or through a later simple GM flow.

### audit_logs

Deferred because detailed audit history is useful later, but not required to validate the core MVP loop.

### campaign_assets / files

Deferred because file uploads, maps, handouts, and media management are outside the P0 MVP.

### comments / revisions

Deferred because Session summary comments and revision workflows are post-MVP collaboration enhancements.
