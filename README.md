# Marketplace

A premium, mobile-first multi-vendor online marketplace built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Quick start

```bash
npm run setup    # install, configure .env.local, verify platform
npm run dev      # start at http://localhost:3000
```

Health check: http://localhost:3000/api/health

See **[docs/SETUP.md](docs/SETUP.md)** for local setup and **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for production release.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | First-time platform setup |
| `npm run verify` | Lint + typecheck + test + build |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run test:e2e:ci` | E2E tests — chromium only (CI) |

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 with design tokens
- **Database:** Supabase (PostgreSQL) — Milestone 3+
- **Auth:** Supabase Auth — Milestone 3+
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + Playwright
- **Deployment:** Vercel

## Project structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
│   ├── layout/       # Header, footer, navigation
│   ├── product/      # Product-specific components
│   ├── pwa/          # PWA install prompt, service worker
│   └── ui/           # Design system primitives
├── config/           # Brand, navigation, manifest
├── contexts/         # React contexts (cart, wishlist)
├── data/             # Seed/mock data (Milestone 2)
├── lib/              # Utilities, Supabase clients, analytics
└── types/            # Shared TypeScript types
docs/                 # Architecture, decisions, progress
supabase/             # Database migrations and seed (Milestone 3)
e2e/                  # Playwright end-to-end tests
```

## Branding

All brand configuration lives in `src/config/brand.ts`. Update this single file to rebrand the entire application — colours, name, tagline, logos, and defaults propagate via CSS variables and Tailwind tokens.

## Environment variables

See `.env.example` for all required variables. Never commit `.env.local` or expose service role keys client-side.

## Milestones

| Milestone | Status | Description |
|-----------|--------|-------------|
| 1 — Foundation | ✅ Complete | Project setup, design tokens, components, PWA, docs |
| 2 — Storefront | ✅ Complete | Homepage, search, product pages, cart, checkout |
| 3 — Database & Auth | ✅ Complete | Supabase migrations, RLS, authentication |
| 4 — Seller Portal | ✅ Complete | Application, dashboard, product management |
| 5 — Administration | ✅ Complete | Moderation, CMS, audit logs |
| 6 — Commerce | ✅ Complete | Payments, order splitting, notifications, returns |
| 7 — Quality & Release | ✅ Complete | E2E, accessibility, security, deployment docs |

## Quality & release docs

| Doc | Purpose |
|-----|---------|
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deploy and rollback |
| [SECURITY.md](docs/SECURITY.md) | Security review checklist |
| [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | WCAG 2.2 AA audit |
| [PERFORMANCE.md](docs/PERFORMANCE.md) | Core Web Vitals targets |

See `docs/PROGRESS.md` for detailed status.

## Deployment

### Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Deploy

### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy project URL and anon key to `.env.local`
3. Run migrations (Milestone 3): `npx supabase db push`

## License

Private — all rights reserved.
