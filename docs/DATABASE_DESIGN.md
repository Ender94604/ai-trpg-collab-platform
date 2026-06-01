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
- Stay small enough for the MVP while leaving clear extension points for NPCs, audit logs, and richer collaboration features.

## 2. Core Business Objects

### Profile

`profiles` stores application-level user profile data for authenticated Supabase users. Authentication itself remains owned by Supabase Auth.

When a new Supabase Auth user is inserted into `auth.users`, the database trigger `on_auth_user_created` calls `public.handle_new_auth_user()` and creates the matching `public.profiles` row automatically. The profile uses `new.id`, `new.email`, and `new.raw_user_meta_data ->> 'display_name'`.

### Campaign

`campaigns` is the central business object. A Campaign is a TRPG workspace created by a GM. Characters, Sessions, AI outputs, and membership records all belong to a Campaign.

### Campaign Member

`campaign_members` links users to Campaigns and stores their role. MVP roles are `gm` and `player`.

### Campaign Invite

`campaign_invites` stores private invite links created by GMs. Invites let authenticated users join a private Campaign as `player` without public Campaign discovery.

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
profiles 1 -- many campaign_invites.created_by
profiles 1 -- many characters.user_id
profiles 1 -- many sessions.created_by
profiles 1 -- many ai_outputs.created_by

campaigns 1 -- many campaign_members
campaigns 1 -- many campaign_invites
campaigns 1 -- many characters
campaigns 1 -- many sessions
campaigns 1 -- many ai_outputs

sessions 1 -- many ai_outputs
```

Deleting a Campaign cascades to `campaign_members`, `campaign_invites`, `characters`, `sessions`, and `ai_outputs`.

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

## 4.4 campaign_invites

Purpose: Stores private Campaign join links created by GMs.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key. Defaults to `gen_random_uuid()`. |
| campaign_id | uuid | Required Campaign ID. Cascades on Campaign delete. |
| token | text | Required unique invite token. Must be random and unpredictable. |
| created_by | uuid | Required creator profile ID. Cascades on profile delete. |
| expires_at | timestamptz | Optional expiration timestamp. Null means no expiration in MVP. |
| created_at | timestamptz | Invite creation timestamp. |

Notes:

- Invite links are not public discovery. A user must have the tokenized `/join/[token]` URL.
- MVP does not implement revoke/delete UI yet, but deleting a Campaign removes its invites.

## 4.5 characters

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

## 4.6 sessions

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

## 4.7 ai_outputs

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
- `campaign_members.role = 'gm'` can create and view invite links for their Campaign.
- `campaign_members.role = 'player'` can view Campaign content exposed to members and manage their own Characters.
- Non-members cannot read or mutate private Campaign data.
- Authenticated users can join a private Campaign only through a valid invite token.

Server actions, route handlers, and data access functions must verify the current user and Campaign membership before returning or mutating private data.

## 6. Index Design

The schema adds indexes for common MVP access patterns:

- Campaign lists by owner: `campaigns(owner_id)`.
- Campaign membership lookup: `campaign_members(user_id)`, `campaign_members(campaign_id)`.
- Invite lookup and listing: `campaign_invites(token)`, `campaign_invites(campaign_id)`.
- Character lists per Campaign and user: `characters(campaign_id)`, `characters(user_id)`.
- Session lists per Campaign and creator: `sessions(campaign_id)`, `sessions(created_by)`.
- AI output history per Campaign, Session, and creator: `ai_outputs(campaign_id)`, `ai_outputs(session_id)`, `ai_outputs(created_by)`.

The unique index on `campaign_members(campaign_id, user_id)` prevents duplicate membership records.

## 7. Auth Profile Trigger

The schema defines:

- `public.handle_new_auth_user()`
- `on_auth_user_created` trigger on `auth.users`

The function is `security definer` and uses a fixed `search_path` so it can insert into `public.profiles` immediately after Supabase Auth creates a user.

Behavior:

- `profiles.id` is set to `auth.users.id`.
- `profiles.email` is copied from `new.email`.
- `profiles.display_name` is copied from `new.raw_user_meta_data ->> 'display_name'` when present.
- `on conflict (id)` updates email and preserves an existing display name when possible.

## 8. RLS Strategy

The MVP schema enables Row Level Security on all application tables:

- `profiles`
- `campaigns`
- `campaign_members`
- `characters`
- `sessions`
- `ai_outputs`
- `campaign_invites`

To avoid recursive policies on `campaign_members`, the schema defines helper functions:

- `public.is_campaign_member(campaign_id uuid, user_id uuid)`
- `public.is_campaign_gm(campaign_id uuid, user_id uuid)`
- `public.is_campaign_owner(campaign_id uuid, user_id uuid)`
- `public.get_campaign_invite(invite_token text)`
- `public.join_campaign_by_invite(invite_token text)`

These helpers use `security definer` where needed and a fixed `search_path = public`.

The invite RPC functions avoid opening broad direct SELECT access to all active invite rows. `get_campaign_invite` returns only minimal Campaign information for a valid token, while `join_campaign_by_invite` validates the token and inserts a `player` membership if the user is not already a member.

## 9. Table Access Rules

### profiles

- Users can view their own profile.
- Users can update their own profile.
- Profile creation is handled by the Auth trigger, not by direct client inserts.

### campaigns

- Authenticated users can create Campaigns when `owner_id = auth.uid()`.
- Campaign members can view Campaigns.
- Campaign owners and GMs can update Campaigns.
- Delete policies are intentionally not added yet; deletion should be handled later through a carefully reviewed GM/owner flow.

### campaign_members

- Campaign members can view membership rows for Campaigns they belong to.
- Campaign owners and GMs can manage membership rows.
- The owner rule allows the initial owner to add the first GM/member rows after Campaign creation.

### campaign_invites

- GMs can view invite links for Campaigns where they are GM.
- GMs can create invite links for Campaigns where they are GM.
- Non-GMs cannot directly manage invite rows.
- Authenticated users use `get_campaign_invite(token)` to read minimal valid invite information.
- Authenticated users use `join_campaign_by_invite(token)` to join as `player`.
- The join RPC rejects missing authentication, invalid tokens, and expired invites.
- Duplicate membership is prevented by `campaign_members(campaign_id, user_id)` and handled with `on conflict do nothing`.

### characters

- Campaign members can view Characters in their Campaign.
- Users can create Characters only for themselves and only in Campaigns where they are members.
- Users can update only their own Characters.
- GMs can view all Characters through the member read rule, but cannot edit player Characters in this MVP policy set.

### sessions

- Campaign members can view Sessions in their Campaign.
- GMs can create Sessions.
- GMs can update Sessions.
- Players cannot create or update Sessions in the MVP.

### ai_outputs

- GMs can view AI outputs.
- GMs can create AI outputs.
- Players cannot view raw AI output history in this MVP policy set. Saved player-visible summaries should be read through `sessions.summary`.

## 10. MVP RLS Limitations

The current RLS policies are intentionally conservative and MVP-oriented:

- There is no Campaign delete policy yet.
- There is no character delete policy yet.
- There is no Session delete policy yet.
- There is no AI output update/delete policy yet.
- There is no invite revoke/delete UI yet.
- Invite expiration exists in the schema but MVP-created invites currently do not set `expires_at`.
- Players cannot view `ai_outputs`; they can only view saved summaries through `sessions`.
- GMs cannot edit player Characters yet, even though that may be useful later.
- Campaign creation and initial membership insertion are separate operations. Application code should create the Campaign and then insert the owner as a `gm` member.
- The policies do not yet distinguish draft/private Session logs from player-visible summaries. Application code should avoid returning sensitive raw logs to players until finer-grained policies or server-side DTOs exist.

Future improvements:

- Add delete policies with explicit owner/GM checks.
- Add DTO/server-side filtering for player-visible Session fields.
- Add invite revoke/delete actions and optional expiration controls.
- Add audit logging for role changes and destructive actions.
- Add stricter profile visibility for non-members.

## 11. Permission Test Scenarios

Before shipping Auth and Campaign features, test these scenarios in Supabase or integration tests:

- A newly signed-up user receives a matching `profiles` row.
- A user can read and update only their own profile.
- An authenticated user can create a Campaign with themselves as `owner_id`.
- A Campaign owner can insert themselves as a `gm` in `campaign_members`.
- A non-member cannot read a private Campaign.
- A Campaign member can read the Campaign and membership list.
- A player cannot update Campaign settings.
- A GM can update Campaign settings.
- A player can create and update their own Character.
- A player cannot update another user's Character.
- A GM can read all Characters in the Campaign.
- A GM can create and update Sessions.
- A player cannot create or update Sessions.
- A GM can create and read AI outputs.
- A player cannot read raw `ai_outputs`.
- A GM can create a Campaign invite.
- A non-GM cannot create a Campaign invite.
- An authenticated non-member can view minimal invite details with a valid token.
- An authenticated user can join a Campaign as `player` with a valid token.
- An invalid or expired invite cannot be used to join.

## 12. Tables Deferred From MVP P0

### npcs

Deferred because AI NPC generation is P1 in the PRD. The MVP P0 validation focuses on AI Session summaries.

### audit_logs

Deferred because detailed audit history is useful later, but not required to validate the core MVP loop.

### campaign_assets / files

Deferred because file uploads, maps, handouts, and media management are outside the P0 MVP.

### comments / revisions

Deferred because Session summary comments and revision workflows are post-MVP collaboration enhancements.
