# MVP Test Report

## 1. Test Overview

This report is a manual end-to-end validation template for the MVP flow:

```text
Auth -> Campaign -> Character -> Session -> AI Summary
```

This document records the manual MVP validation completed for the core flow. GM-side and Player join/view flows have passed, while Password Reset email-link validation remains blocked by Supabase email rate limit.

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
5. Add GM Notes / Session Prep and Session Transcript
6. Generate AI Summary
7. Verify `sessions.summary`
8. Verify `ai_outputs`
9. Logout
10. Create invite link
11. Player joins Campaign through `/join/[token]`
12. Player permission check

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
| TC-008 | Session creation | Create a Session from the Campaign Sessions page as GM. | Session is created and appears in the Session list. | GM created a Session; `sessions` has correct `campaign_id` and `created_by`. | Passed | Session data model now separates GM Notes / Session Prep from Session Transcript. |
| TC-009 | Session GM notes and transcript edit | Edit Session title, date, GM Notes / Session Prep, and Session Transcript as GM. | Session updates are saved and displayed to GM. | GM Notes / Session Prep and Session Transcript were saved and visible to GM. | Passed | Voice transcription is not implemented; transcript is manually pasted in MVP. |
| TC-010 | AI Summary generation | Generate AI Summary from a Session with non-empty Session Transcript. | Structured summary is generated from transcript and displayed. | GM generated AI Summary from Session Transcript; DeepSeek returned structured summary. | Passed | AI Summary no longer uses `raw_log` as the primary source. |
| TC-011 | `sessions.summary` persistence | Refresh the Session detail page and inspect Supabase. | Summary remains visible and is stored in `sessions.summary`. | `sessions.summary` was updated; summary remained visible after refresh. | Passed |  |
| TC-012 | `ai_outputs` insertion | Inspect `ai_outputs` after summary generation. | A row exists with `type = session_summary`. | `ai_outputs` contains a row with `type = session_summary`. | Passed |  |
| TC-013 | Empty transcript error | Attempt summary generation with empty Session Transcript. | Clear error is shown and AI API is not called. | GM clicked Generate Summary on a Session with empty transcript; a clear error was shown and no AI Summary was generated. | Passed | Expected error: Session transcript is empty. Add the actual session transcript before generating a summary. |
| TC-014 | Player cannot generate summary | Login as Player and view a Session detail page. | Generate Summary button is not visible; direct API call is rejected. | Player joined through invite link and viewed Session Detail; Generate Summary button was not visible. | Passed | UI-level permission check passed. Direct API rejection still needs manual API-level check. |
| TC-015 | Non-member cannot access private Campaign | Login as a user who is not a Campaign member and visit Campaign routes. | Private Campaign data is not shown. | Non-member account directly visited a private Campaign URL; private Campaign data was not shown. | Passed |  |
| TC-016 | Password Reset email-link flow | Request a password reset email, click the Supabase email link, verify `/auth/confirm` establishes a recovery session, update password from `/update-password`, then login with the new password. | User can update password through the email link without re-entering email, then login with the new password. | Code implements token_hash + verifyOtp flow and lint/build passed, but real email-link validation could not be completed. | Blocked | Blocked by Supabase email rate limit, pending manual email-link validation. |
| TC-017 | Invite Link / Join Campaign | GM creates an invite link from Campaign Settings; Player logs in, opens `/join/[token]`, joins the Campaign, and checks Dashboard plus Campaign pages. | Player joins as `player`, appears in `campaign_members`, sees the Campaign in Dashboard, and can view Campaign / Characters / Sessions. | Invite Link / Join Campaign flow passed; `campaign_members` contains `role = player`; Player Dashboard shows the joined Campaign; Player can view Campaign / Characters / Sessions. | Passed | No public Campaign discovery was used. |
| TC-018 | Session private fields hidden from Player | Login as Player and open Session Detail. | Player can see saved AI Summary but cannot see GM Notes / Session Prep or Session Transcript. | Player could see saved AI Summary; GM Notes / Session Prep and Session Transcript were not visible. | Passed | Confirms Player-facing Session Detail hides GM-only prep and transcript content. |
| TC-019 | Legacy `raw_log` compatibility | Inspect legacy Session behavior after Session model correction. | Existing `raw_log` data is retained but no longer used as AI Summary source. | Legacy `raw_log` remains retained for backward compatibility; new AI Summary input is Session Transcript. | Passed | No voice transcription implemented. |

Status values: `Passed`, `Failed`, `Blocked`, `Not Run`.

## 6. Database Verification Checklist

Check the following tables in Supabase Table Editor:

- [x] `auth.users`
- [x] `profiles`
- [x] `campaigns`
- [x] `campaign_members`
- [x] `campaign_invites`
- [x] `characters`
- [x] `sessions`
- [x] `ai_outputs`

## 7. Known Risks

- AI generation is not transactional with `ai_outputs` insertion.
- Session Transcript is a plain textarea in the MVP.
- Legacy `raw_log` is retained for compatibility but is no longer the AI Summary source.
- Player Generate Summary restriction has been validated at the UI level; direct AI Summary API rejection still needs manual API-level verification.
- Password Reset uses token_hash + verifyOtp flow, but manual email-link validation is blocked by Supabase email rate limit.
- UI is MVP-level.
- No deployment yet.

## 8. Friend Trial Feedback

- Password Reset has been implemented with token_hash + verifyOtp flow, but has not yet passed manual email-link validation because Supabase email rate limit is currently blocking testing.
- Newly registered users can now join Campaigns through GM-created invite links. Public Campaign discovery remains intentionally out of scope.

## 9. Final Result

| Result | Selection |
|---|---|
| Passed | `[x]` |
| Failed | `[ ]` |
| Blocked | `[x]` |

Summary:

```text
MVP manually validated with core GM and Player flows, while Password Reset
email-link validation remains blocked by Supabase rate limit.

The core MVP flow was manually validated for a GM account:
Auth -> Campaign -> Character -> Session -> AI Summary.

Invite Link / Join Campaign flow was manually validated for a Player account:
GM creates invite -> Player opens /join/[token] -> Player joins as role = player.

Empty transcript error handling passed.
Non-member private Campaign access check passed.
Player Session Detail UI does not show Generate Summary.
Player can see saved AI Summary but cannot see GM Notes / Session Prep or
Session Transcript.
Legacy raw_log is retained but no longer used as the AI Summary source.
Password Reset manual validation is blocked by Supabase email rate limit,
pending manual email-link validation.

Supabase records were verified for auth.users, profiles, campaigns,
campaign_members, campaign_invites, characters, sessions, and ai_outputs.
```

Follow-up items:

```text
Pending checks:
- Direct AI Summary API rejection for Player account.
- Character self-edit as a separate explicit test.
- Password Reset email-link validation after Supabase email rate limit clears.
```
