# Security Review

Security posture for the Marketplace platform. Last reviewed: Milestone 7.

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Security headers | ✅ | Middleware applies headers on all matched routes |
| HSTS | ✅ | Enabled in production via middleware |
| CSP | ⚠️ | Active; uses `unsafe-inline`/`unsafe-eval` for Next.js dev compatibility |
| RLS | ✅ | All Supabase tables have Row Level Security |
| Auth | ✅ | Supabase Auth + server-side session refresh |
| Service role | ✅ | Server-only; used for order creation and admin writes |
| Payment webhooks | ⚠️ | Scaffold only; signature verification stub until provider chosen |
| Secrets | ✅ | `.env.local` gitignored; documented in `.env.example` |

## Security headers

Implemented in `src/lib/security/headers.ts` and applied via `src/middleware.ts`:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | Production only — `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | Page routes only — see headers module |

Automated verification: `e2e/platform.spec.ts` and `src/lib/security/headers.test.ts`.

## Authentication & authorization

- All protected routes use server-side guards (`requireAuth`, `requireAdmin`, `requireApprovedSeller`)
- Role checks via `user_roles` table — never trust client-side role claims
- Admin actions write to `audit_logs`
- Session refresh in middleware when Supabase is configured

## Data access

- **Anon key:** Client-safe; RLS enforces access boundaries
- **Service role:** Order creation, refunds, audit writes — never imported in client components
- **Guest checkout:** Orders stored with `guest_email`; linked to account on login (future enhancement)

## CSP hardening (future)

Current CSP allows inline scripts for Next.js hydration. Before strict CSP:

1. Enable nonce-based CSP via Next.js `headers()` config
2. Remove `'unsafe-eval'` in production
3. Add reporting endpoint (`report-uri` / `report-to`)

## Pre-production checklist

- [ ] Rotate all Supabase keys after staging setup
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is not in client bundle (`npm run build` + search `.next/static`)
- [ ] Enable Vercel deployment protection for preview environments
- [ ] Configure rate limiting on auth endpoints (OPEN_DECISIONS #13)
- [ ] Review RLS policies with a second pair of eyes
- [ ] Set up dependency scanning (Dependabot / Snyk)
- [ ] Configure real payment webhook signature verification
- [ ] Penetration test before public launch (recommended)

## Reporting vulnerabilities

Document your security contact process here before public launch. Do not commit security issue details in public issues.
