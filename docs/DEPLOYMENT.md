# Deployment Guide

Production deployment checklist for the Marketplace platform on Vercel + Supabase.

## Prerequisites

- GitHub repository with `main` branch protected
- Vercel account linked to the repository
- Supabase project (Pro recommended for production)
- Domain configured (optional but recommended)

## 1. Supabase (production)

```bash
# Link local project to production Supabase
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
npm run db:push

# Generate TypeScript types
npm run db:types
```

### Post-migration checklist

- [ ] Verify RLS is enabled on all tables (`supabase/migrations/20250731000005_rls_policies.sql`)
- [ ] Create initial super-admin user via Supabase Auth dashboard
- [ ] Assign `super_admin` role in `user_roles` table
- [ ] Confirm `platform_settings` seed values (commission, delivery)
- [ ] Rotate service role key after initial setup

## 2. Vercel environment variables

Set in **Project → Settings → Environment Variables** (Production + Preview):

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_APP_URL` | Yes | `https://your-domain.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only — never expose to client |
| `PAYMENT_PROVIDER` | Yes | `mock` until Stripe/PayPal decision (#3) |
| `EMAIL_PROVIDER` | Yes | `mock` until SendGrid/Resend decision (#9) |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No | `mock`, `plausible`, or `google` |
| `NEXT_PUBLIC_ANALYTICS_ID` | No | Required when using real analytics |

## 3. Deploy

```bash
# Preview deploy (automatic on PR)
git push origin feature-branch

# Production deploy
git push origin main
```

Vercel runs the CI pipeline from `.github/workflows/ci.yml` on push/PR.

## 4. Post-deploy smoke test

Run within 5 minutes of a production deploy:

```bash
# Health check
curl -s https://your-domain.com/api/health | jq .

# Expected: { "status": "healthy", "platform": { "supabase": "configured", ... } }

# Security headers
curl -sI https://your-domain.com/ | grep -iE 'x-frame|x-content|strict-transport|content-security'

# PWA manifest
curl -s https://your-domain.com/manifest.json | jq .name
```

### Manual browser checks

- [ ] Homepage loads with product sections
- [ ] Search and product detail pages work
- [ ] Guest checkout completes (mock payment until provider configured)
- [ ] Login/register with Supabase auth
- [ ] Seller portal accessible for approved sellers
- [ ] Admin dashboard accessible for admin roles
- [ ] `/offline` page renders when simulating offline (after SW caches)

## 5. Rollback

If a deploy causes issues:

1. **Vercel instant rollback:** Deployments → select previous deployment → Promote to Production
2. **Database:** Migrations are forward-only — do not reset production. Fix forward with a new migration.
3. **Verify rollback:** Re-run post-deploy smoke tests above

## 6. Monitoring (recommended)

| Area | Tool | Action |
|------|------|--------|
| Uptime | Vercel Analytics / Better Stack | Alert on `/api/health` failures |
| Errors | Vercel Logs / Sentry | Track 5xx and server action errors |
| Performance | Vercel Speed Insights / Lighthouse | Track LCP, INP, CLS |
| Security | Dependabot / npm audit | Weekly dependency review |

## 7. Release cadence

1. Feature branch → PR → CI green (lint, typecheck, unit, build, E2E)
2. Preview deploy review on Vercel
3. Merge to `main` → production deploy
4. Post-deploy smoke test
5. Update `docs/PROGRESS.md` if milestone scope changed

## Related docs

- [SETUP.md](./SETUP.md) — local development setup
- [SECURITY.md](./SECURITY.md) — security review checklist
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — WCAG compliance notes
- [PERFORMANCE.md](./PERFORMANCE.md) — Core Web Vitals targets
- [OPEN_DECISIONS.md](./OPEN_DECISIONS.md) — blocked integrations
