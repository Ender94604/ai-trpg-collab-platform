# MVP Test Report

## 1. Test Overview

This report is a manual end-to-end validation template for the MVP flow:

```text
Auth -> Campaign -> Character -> Session -> AI Summary
```

Use this document to record manual test results before treating the MVP as validated.

## 2. Test Environment

| Item | Value |
|---|---|
| Local URL | `http://localhost:3000` |
| Supabase project | `<manual fill>` |
| DeepSeek model | `deepseek-v4-flash` |
| Test date | `<manual fill>` |
| Tester | `<manual fill>` |

## 3. Test Accounts

Do not record real passwords in this document.

| Role | Email | Password Stored Elsewhere | Notes |
|---|---|---|---|
| GM account | `<manual fill>` | Yes / No | `<manual fill>` |
| Player account | `<manual fill>` | Yes / No | `<manual fill>` |

## 4. End-to-End Test Flow

1. Register / Login
2. Create Campaign
3. Create Character
4. Create Session
5. Write `raw_log`
6. Generate AI Summary
7. Verify `sessions.summary`
8. Verify `ai_outputs`
9. Logout
10. Player permission check

## 5. Test Cases

| ID | Scenario | Steps | Expected Result | Actual Result | Status | Notes |
|---|---|---|---|---|---|---|
| TC-001 | Auth registration | Register a new GM account from `/login`. | User is created and redirected to `/dashboard`. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-002 | Auth login | Login with an existing GM account. | User reaches `/dashboard` and sees account information. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-003 | Dashboard protection | Visit `/dashboard` while logged out. | User is redirected to `/login`. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-004 | Campaign creation | Create a Campaign from `/campaigns/new`. | Campaign is created and user is redirected to Campaign Overview. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-005 | `campaign_members` GM insertion | Check the new Campaign membership in Supabase. | Creator has a `gm` row in `campaign_members`. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-006 | Character creation | Create a Character from the Campaign Characters page. | Character appears in the list and is linked to the Campaign and user. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-007 | Character self-edit | Edit the current user's Character. | Updated Character fields are saved and displayed. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-008 | Session creation | Create a Session from the Campaign Sessions page as GM. | Session is created and appears in the Session list. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-009 | Session `raw_log` edit | Edit Session title, date, or `raw_log` as GM. | Session updates are saved and displayed on the detail page. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-010 | AI Summary generation | Generate AI Summary from a Session with non-empty `raw_log`. | Structured summary is generated and displayed. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-011 | `sessions.summary` persistence | Refresh the Session detail page and inspect Supabase. | Summary remains visible and is stored in `sessions.summary`. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-012 | `ai_outputs` insertion | Inspect `ai_outputs` after summary generation. | A row exists with `type = session_summary`. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-013 | Empty `raw_log` error | Attempt summary generation with empty `raw_log`. | Clear error is shown and AI API is not called. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-014 | Player cannot generate summary | Login as Player and view a Session detail page. | Generate Summary button is not visible; direct API call is rejected. | `<manual fill>` | Not Run | `<manual fill>` |
| TC-015 | Non-member cannot access private Campaign | Login as a user who is not a Campaign member and visit Campaign routes. | Private Campaign data is not shown. | `<manual fill>` | Not Run | `<manual fill>` |

Status values: `Passed`, `Failed`, `Blocked`, `Not Run`.

## 6. Database Verification Checklist

Check the following tables in Supabase Table Editor:

- [ ] `auth.users`
- [ ] `profiles`
- [ ] `campaigns`
- [ ] `campaign_members`
- [ ] `characters`
- [ ] `sessions`
- [ ] `ai_outputs`

## 7. Known Risks

- AI generation is not transactional with `ai_outputs` insertion.
- `raw_log` is a plain textarea.
- Player access to `raw_log` may need privacy refinement.
- UI is MVP-level.
- No deployment yet.

## 8. Final Result

| Result | Selection |
|---|---|
| Passed | `[ ]` |
| Failed | `[ ]` |
| Blocked | `[ ]` |

Summary:

```text
<manual fill>
```

Follow-up items:

```text
<manual fill>
```
