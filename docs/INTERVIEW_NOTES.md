# Interview Notes

## 1. Project Pitch

AI-TRPG Collaboration Platform is a full-stack AI collaboration workspace for tabletop role-playing game groups.

The MVP helps game masters and players manage the core campaign workflow in one place: users can register, create a Campaign, add Character sheets, record Session logs, and generate structured AI Session summaries with DeepSeek. The project is designed as a practical AI product demo that shows product thinking, full-stack implementation, permission modeling, database design, and AI API integration.

## 2. Product Thinking

### Target Users

- Game Masters / Keepers / Dungeon Masters who organize long-running TRPG campaigns.
- Players who need to maintain Character information and review past Session summaries.

### Core Pain Points

- Campaign information is often scattered across documents, chat logs, screenshots, spreadsheets, and personal notes.
- Character sheets are inconsistent across players and difficult for the GM to review quickly.
- Long-running campaigns suffer from memory gaps between Sessions.
- Post-session recaps are valuable but time-consuming for GMs to write manually.

### Why Focus on Game Masters First

The GM is the core organizer of a TRPG campaign. The GM creates the Campaign workspace, maintains Session logs, and decides whether AI-generated summaries are useful. If the GM workflow is valuable, players have a natural reason to join and maintain Character sheets.

### Why Not Build a Community First

Community features need network effects, content supply, moderation, discovery, and social graph design. Those are expensive to validate early. The MVP instead focuses on a single campaign group's internal workflow, where the value can be tested with a much smaller surface area.

## 3. MVP Scope

The MVP loop is:

```text
Auth -> Campaign -> Character -> Session -> AI Summary
```

Implemented MVP features:

- Supabase Auth registration, login, and logout.
- Protected Dashboard.
- Campaign creation and Campaign navigation.
- Character sheet creation and self-editing.
- Session creation and raw log recording.
- DeepSeek-based structured AI Session Summary.
- Summary persistence to `sessions.summary`.
- AI output audit trail in `ai_outputs`.
- Basic GM / Player role boundaries.

Out of scope for MVP:

- Public community.
- Invite links.
- AI NPC generation.
- Full rules engine.
- Real-time collaboration.
- Voice, video, or map tools.
- Payments.

## 4. Technical Architecture

### Stack

- Next.js App Router for routing, Server Components, Route Handlers, and Server Actions.
- TypeScript for typed application code.
- Tailwind CSS for MVP UI.
- Supabase Auth for user authentication.
- Supabase PostgreSQL for persistence.
- Row Level Security for database-level authorization.
- DeepSeek OpenAI-compatible Chat Completions API for AI summaries.

### High-Level Architecture

```text
Next.js App Router
-> Server Components / Server Actions / Route Handlers
-> Supabase client with user session
-> PostgreSQL tables protected by RLS
-> DeepSeek API called only from server route handler
```

The browser never receives the DeepSeek API key or Supabase service role key. Ordinary user workflows use the Supabase anon key plus the current user session.

## 5. Database Design

Campaign is the central business object because TRPG information naturally belongs to a campaign workspace. Members, Characters, Sessions, and AI outputs are all scoped by `campaign_id`.

Core tables:

- `campaigns`: Campaign workspace metadata such as title, description, system type, world setting, owner, and visibility.
- `campaign_members`: User membership and role for each Campaign. MVP roles are `gm` and `player`.
- `characters`: Character sheets owned by users and scoped to a Campaign.
- `sessions`: Session records with title, date, raw log, and saved AI summary.
- `ai_outputs`: AI generation history, including prompt, output, type, Campaign, Session, and creator.

Relationship summary:

```text
campaigns 1 -> many campaign_members
campaigns 1 -> many characters
campaigns 1 -> many sessions
campaigns 1 -> many ai_outputs
sessions 1 -> many ai_outputs
profiles 1 -> many campaign_members / characters / sessions / ai_outputs
```

Deleting a Campaign cascades to membership, Characters, Sessions, and AI outputs.

## 6. Permission Design

MVP roles:

- GM: can create and manage Campaign content, create and edit Sessions, and generate AI summaries.
- Player: can view Campaign content, create and edit their own Character, and view saved Session summaries.

Permission checks happen in two places:

- Server-side application logic checks the current user and role before reads or mutations.
- Supabase RLS policies enforce data access at the database level.

The UI may hide buttons for better usability, but hidden buttons are not a security boundary. Server Actions and Route Handlers are still callable through HTTP requests, so authorization must be enforced close to the data access layer.

## 7. AI Summary Design

The AI Summary flow:

```text
GM opens Session detail
-> clicks Generate Summary
-> client calls POST /api/ai/summarize
-> server verifies authenticated user
-> server verifies user is Campaign GM
-> server reads Campaign context
-> server reads Character list
-> server reads Session raw_log
-> server builds prompt
-> server calls DeepSeek Chat Completions API
-> server normalizes JSON response
-> server updates sessions.summary
-> server inserts ai_outputs row
-> UI renders structured summary
```

Prompt design:

- Use Campaign information and Character sheets as context.
- Use Session `raw_log` as the source of truth.
- Tell the model not to invent important facts that do not appear in the raw log.
- Allow organization, classification, and summarization.
- Require JSON output with stable fields:
  - `overview`
  - `clues`
  - `decisions`
  - `npcChanges`
  - `openQuestions`
  - `nextSessionTips`

Persistence:

- `sessions.summary` stores the latest saved structured summary.
- `ai_outputs` stores the generation history with `type = session_summary`, prompt, output, Campaign, Session, and creator.

## 8. Trade-offs

### Why Not Build Community Features First

Community features add discovery, moderation, content quality, and cold-start problems. The MVP validates utility inside one campaign group first.

### Why Not Build a Full Rules System

DND, COC, PF, and homebrew systems have different Character sheet structures. A full rules engine would increase complexity before validating the core workflow. The MVP uses generic Character fields first.

### Why Not Build Real-Time Collaboration

Real-time editing requires presence, conflict handling, and more complex data synchronization. The MVP focuses on durable records and simple form submissions.

### Why Use a Plain Textarea for `raw_log`

The first validation goal is whether AI summaries reduce recap work. A textarea is enough to capture long-form Session notes and avoids rich-text editor complexity.

### Why Store `stats` and `inventory` as Simplified JSON

The database uses `jsonb` so future rule templates can evolve. In the MVP UI, `stats` and `inventory` are entered as simple text and stored as `{ text: "..." }`, keeping the interface simple while preserving a flexible storage type.

## 9. Validation Result

Manual validation is recorded in [MVP Test Report](./MVP_TEST_REPORT.md).

Current result:

- GM-side end-to-end flow has passed manual validation.
- Verified flow: Auth -> Campaign -> Character -> Session -> AI Summary.
- Supabase records were checked for `auth.users`, `profiles`, `campaigns`, `campaign_members`, `characters`, `sessions`, and `ai_outputs`.

Pending checks:

- Player permission behavior.
- Non-member private Campaign access control.
- Empty `raw_log` AI summary error path.

The project is not deployed yet and does not claim real user adoption.

## 10. Interview Q&A

### 1. What problem does this project solve?

It helps TRPG game masters centralize campaign data and reduce the manual effort of writing post-session recaps. The core pain point is that long-running campaigns accumulate scattered information across many tools.

### 2. Why did you choose this MVP scope?

The MVP focuses on the smallest useful loop: Auth, Campaign, Character, Session, and AI Summary. This validates whether structured records plus AI-generated summaries can reduce GM workload.

### 3. Why is Campaign the central model?

Campaign is the natural workspace boundary. Members, Characters, Sessions, and AI outputs all belong to a Campaign, which keeps routing, permissions, and database relationships aligned.

### 4. How did you handle authorization?

Authorization is handled through server-side checks and Supabase RLS. The UI hides actions for the wrong role, but server actions and route handlers also verify the current user's Campaign role.

### 5. Why use Supabase?

Supabase provides Auth, PostgreSQL, RLS, and a straightforward JavaScript client. It is a good fit for a full-stack MVP that needs real authentication and database-level permission controls.

### 6. How does the AI Summary feature work?

The server verifies that the user is a GM, gathers Campaign context, Character cards, and the Session raw log, then calls DeepSeek's OpenAI-compatible API. The structured JSON result is saved to `sessions.summary` and logged in `ai_outputs`.

### 7. Why use DeepSeek instead of an OpenAI-specific SDK?

The project uses DeepSeek's OpenAI-compatible Chat Completions API through `fetch`. This keeps the provider integration simple and avoids adding an extra AI SDK for the MVP.

### 8. What are the main security considerations?

API keys must stay server-side. The Supabase service role key is not used for normal user flows. Private Campaign data must be checked by user session and Campaign membership. GM-only actions must be enforced on the server.

### 9. What would you improve next?

I would finish permission testing for Player and non-member flows, refactor Campaign pages into a shared layout, deploy to Vercel, add invite links, and then explore AI NPC generation as a P1 feature.

### 10. What does this project demonstrate for an FDE or full-stack role?

It demonstrates turning a vertical workflow into a deliverable product: scoping an MVP, designing data models, implementing full-stack flows, integrating an AI API, enforcing permissions, and documenting validation status clearly.
