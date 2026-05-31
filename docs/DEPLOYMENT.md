# Deployment

## 1. Platform

- Netlify

## 2. Live Demo

- https://royce-ai-trpg-platform.netlify.app

## 3. Deployment Source

- GitHub `main` branch

## 4. Framework

- Next.js

## 5. Build Settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `.next` |

## 6. Required Environment Variables

Configure these variables in Netlify project settings:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DEEPSEEK_API_KEY
DEEPSEEK_BASE_URL
DEEPSEEK_MODEL
```

Do not commit real API keys or secrets to the repository.

## 7. Supabase Auth URL Configuration

Supabase Auth should be configured to match the deployed Netlify application.

- Site URL should be the Netlify URL:
  - `https://royce-ai-trpg-platform.netlify.app`

- Redirect URLs should include:
  - `https://royce-ai-trpg-platform.netlify.app/**`
  - `http://localhost:3000/**`

## 8. Deployment Notes

- Root path `/` redirects to `/login`.
- Netlify auto-deploys from GitHub `main`.
- No real API keys should be committed.
- DeepSeek API key is server-side only.
- The project does not claim real user adoption.
