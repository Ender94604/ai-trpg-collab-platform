# MVP Test Report

## 1. Test Overview

This report is a manual end-to-end validation template for the MVP flow:

```text
Auth -> Campaign -> Character -> Session -> AI Summary
```

This document records the manual MVP validation completed for the core flow. Permission edge cases remain pending.

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
| TC-001 | Auth registration | Register a new GM account from `/login`. | User is created and redirected to `/dashboard`. | GM registration succeeded; `auth.users` contains the new user. | Passed | No real password recorded. |
| TC-002 | Auth login | Login with an existing GM account. | User reaches `/dashboard` and sees account information. | GM login succeeded. | Passed | No real password recorded. |
| TC-003 | Dashboard protection | Visit `/dashboard` while logged out. | User is redirected to `/login`. | Unauthenticated Dashboard access redirected to Login. | Passed |  |
| TC-004 | Campaign creation | Create a Campaign from `/campaigns/new`. | Campaign is created and user is redirected to Campaign Overview. | GM created a Campaign; `campaigns` contains a new record. | Passed |  |
| TC-005 | `campaign_members` GM insertion | Check the new Campaign membership in Supabase. | Creator has a `gm` row in `campaign_members`. | Creator membership row exists with `role = gm`. | Passed |  |
| TC-006 | Character creation | Create a Character from the Campaign Characters page. | Character appears in the list and is linked to the Campaign and user. | GM created a Character; `characters` has correct `campaign_id` and `user_id`. | Passed |  |
| TC-007 | Character self-edit | Edit the current user's Character. | Updated Character fields are saved and displayed. | Not explicitly verified in this test run. | Not Run | Follow-up recommended. |
| TC-008 | Session creation | Create a Session from the Campaign Sessions page as GM. | Session is created and appears in the Session list. | GM created a Session with `raw_log`; `sessions` has correct `campaign_id`, `created_by`, and `raw_log`. | Passed |  |
| TC-009 | Session `raw_log` edit | Edit Session title, date, or `raw_log` as GM. | Session updates are saved and displayed on the detail page. | Not explicitly verified as a separate edit after creation. | Not Run | Follow-up recommended. |
| TC-010 | AI Summary generation | Generate AI Summary from a Session with non-empty `raw_log`. | Structured summary is generated and displayed. | GM clicked Generate Summary; DeepSeek returned structured summary. | Passed |  |
| TC-011 | `sessions.summary` persistence | Refresh the Session detail page and inspect Supabase. | Summary remains visible and is stored in `sessions.summary`. | `sessions.summary` was updated; summary remained visible after refresh. | Passed |  |
| TC-012 | `ai_outputs` insertion | Inspect `ai_outputs` after summary generation. | A row exists with `type = session_summary`. | `ai_outputs` contains a row with `type = session_summary`. | Passed |  |
| TC-013 | Empty `raw_log` error | Attempt summary generation with empty `raw_log`. | Clear error is shown and AI API is not called. | Not tested. | Not Run | Pending. |
| TC-014 | Player cannot generate summary | Login as Player and view a Session detail page. | Generate Summary button is not visible; direct API call is rejected. | Not tested. | Not Run | Pending permission check. |
| TC-015 | Non-member cannot access private Campaign | Login as a user who is not a Campaign member and visit Campaign routes. | Private Campaign data is not shown. | Not tested. | Not Run | Pending permission check. |

Status values: `Passed`, `Failed`, `Blocked`, `Not Run`.

## 6. Database Verification Checklist

Check the following tables in Supabase Table Editor:

- [x] `auth.users`
- [x] `profiles`
- [x] `campaigns`
- [x] `campaign_members`
- [x] `characters`
- [x] `sessions`
- [x] `ai_outputs`

## 7. Known Risks

- AI generation is not transactional with `ai_outputs` insertion.
- `raw_log` is a plain textarea.
- Player access to `raw_log` may need privacy refinement.
- UI is MVP-level.
- No deployment yet.

## 8. Final Result

| Result | Selection |
|---|---|
| Passed | `[x]` |
| Failed | `[ ]` |
| Blocked | `[ ]` |

Summary:

```text
Passed with pending permission checks.

The core MVP flow was manually validated for a GM account:
Auth -> Campaign -> Character -> Session -> AI Summary.

Supabase records were verified for auth.users, profiles, campaigns,
campaign_members, characters, sessions, and ai_outputs.
```

Follow-up items:

```text
Pending checks:
- Player permission behavior.
- Non-member private Campaign access control.
- Empty raw_log summary generation error.
- Character self-edit as a separate explicit test.
- Session raw_log edit as a separate explicit test.
```
