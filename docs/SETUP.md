# Platform Setup Guide

This guide gets the framework running locally and connected to GitHub, Vercel, and Supabase.

## Prerequisites

- Node.js 20+ (22 recommended)
- npm 10+
- Git
- [GitHub CLI](https://cli.github.com/) (optional)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for Milestone 3+)

## 1. Local development (5 minutes)

```bash
# One-command setup
npm run setup

# Or manually:
cp .env.example .env.local
npm install
npm run verify
npm run dev
```

Open http://localhost:3000

**Health check:** http://localhost:3000/api/health

Expected response:
```json
{
  "status": "healthy",
  "platform": {
    "app": "ok",
    "environment": "development",
    "supabase": "not_configured",
    "paymentProvider": "mock",
    "emailProvider": "mock",
    "analyticsProvider": "mock"
  }
}
```

The app runs fully on seed data until Supabase is connected.

## 2. Verify platform

```bash
npm run verify    # lint + typecheck + test + build
npm run test:e2e  # Playwright smoke tests (optional)
```

## 3. GitHub

```bash
# Configure git identity (once per machine)
git config user.email "you@example.com"
git config user.name "Your Name"

# Initial commit
git add -A
git commit -m "Platform foundation ready"

# Create remote repo
gh repo create marketplace --private --source=. --remote=origin --push
```

CI runs automatically via `.github/workflows/ci.yml` on every push to `main`.

## 4. Vercel deployment

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://marketplace.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase dashboard (server only) |

5. Deploy

Preview deployments are created automatically for pull requests.

## 5. Supabase (Milestone 3)

```bash
# Install CLI
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# When migrations are ready:
npm run db:push
```

Add credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Restart dev server. Health check will show `"supabase": "configured"`.

### Create admin user (development)

After registering a normal account, promote to admin via Supabase SQL editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'super_admin');
```

## 6. Auth routes

| Route | Purpose |
|-------|---------|
| `/account/login` | Sign in |
| `/account/register` | Create account |
| `/account/forgot-password` | Password reset |
| `/auth/callback` | Email confirmation handler |

## Environment variables reference

| Variable | Required | Client-safe | Description |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes (prod) | Yes | Canonical app URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Milestone 3+ | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Milestone 3+ | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Milestone 3+ | **No** | Server-only admin key |
| `PAYMENT_PROVIDER` | No | No | `mock` (default), `stripe`, `paypal` |
| `EMAIL_PROVIDER` | No | No | `mock` (default), `sendgrid`, `resend` |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No | Yes | `mock` (default), `plausible`, `google` |

Never commit `.env.local`. Use `.env.example` as the template.

## Platform architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────▶│   Next.js    │────▶│  Supabase    │
│  (hosting)   │     │  (app/API)   │     │ (DB/Auth)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
  Auto-deploy          Middleware            RLS + Auth
  Preview URLs         Health API            Storage
                       Mock providers        Realtime
```

## Troubleshooting

**Build fails with env errors**
→ Ensure `NEXT_PUBLIC_APP_URL` is set in production (Vercel env vars).

**Supabase not connecting**
→ Check URL and anon key match your project. Restart dev server after changing `.env.local`.

**Images not loading**
→ Unsplash images require network access. Local placeholders used as fallback.

**PWA install not showing**
→ Install prompt appears after 3 engagement events (view product, add to cart, etc.).

## What's ready vs. what's next

| Component | Status |
|-----------|--------|
| Next.js app framework | ✅ Ready |
| Design system & brand config | ✅ Ready |
| PWA (manifest, SW, icons) | ✅ Ready |
| Security middleware | ✅ Ready |
| Health check API | ✅ Ready |
| CI pipeline | ✅ Ready |
| Mock payment/analytics/email | ✅ Ready |
| Seed data storefront | ✅ Ready |
| Supabase migrations & RLS | ✅ Ready (apply with `npm run db:push`) |
| Authentication | ✅ Ready (needs Supabase credentials) |
| Real payments | 🔲 Milestone 6 |
| Seller/Admin portals | 🔲 Milestones 4–5 |

Once platform setup is complete, development can proceed feature-by-feature without infrastructure changes.
