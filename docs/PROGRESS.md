# Progress

Last updated: Milestone 7 complete

## Platform status: ✅ READY FOR DEVELOPMENT

The framework, tooling, and deployment scaffolding are complete. The app runs locally on seed data without Supabase. Connect external services when ready.

| Check | Command | Status |
|-------|---------|--------|
| Lint | `npm run lint` | ✅ |
| Typecheck | `npm run typecheck` | ✅ |
| Unit tests | `npm run test` | ✅ (41 tests) |
| E2E tests | `npm run test:e2e` | ✅ (19 scenarios) |
| Production build | `npm run build` | ✅ |
| Health API | `GET /api/health` | ✅ |
| CI pipeline | `.github/workflows/ci.yml` | ✅ |
| Setup guide | `docs/SETUP.md` | ✅ |

**Quick start:** `npm run setup && npm run dev`

## Milestone 1: Foundation ✅

- [x] Next.js 16 project with TypeScript strict mode
- [x] Tailwind CSS 4 with design tokens and brand colours
- [x] Centralized brand configuration (`src/config/brand.ts`)
- [x] Navigation configuration
- [x] Shared UI component system (Button, Input, Select, Badge, Skeleton, EmptyState, Rating)
- [x] Environment validation with Zod (`src/lib/env.ts`)
- [x] Supabase client architecture (browser, server, admin)
- [x] PWA manifest, service worker, install prompt, offline page
- [x] Analytics abstraction (mock provider)
- [x] Payment provider abstraction (mock provider)
- [x] ESLint + Prettier configuration
- [x] Vitest + Playwright test setup
- [x] Documentation (README, ARCHITECTURE, ASSUMPTIONS, OPEN_DECISIONS)

## Milestone 2: Storefront Prototype ✅

- [x] Global layout (announcement bar, header, footer, mobile bottom nav)
- [x] Homepage with configurable sections (hero, categories, featured, trending, new, deals, sellers, trust, seller recruitment)
- [x] Category pages
- [x] Search with filters, sort, pagination, active filter chips
- [x] Product detail page (gallery, variants, actions, reviews, related)
- [x] Wishlist with localStorage persistence
- [x] Cart with multi-seller grouping, save for later, undo remove, coupons
- [x] Checkout flow (contact, address, shipping, payment, review)
- [x] Order confirmation page
- [x] Customer account shell with navigation
- [x] Seller recruitment page
- [x] Seed data: 6 categories, 5 sellers, 32 products, reviews
- [x] SEO: metadata, sitemap, robots, JSON-LD product schema
- [x] Unit tests for utils and seed data
- [x] E2E test scaffold for critical storefront flows

## Milestone 3: Database & Authentication ✅

- [x] Supabase SQL migrations (6 files: enums, profiles/roles, catalog, commerce, RLS, seed)
- [x] ERD documented in `docs/DATABASE.md`
- [x] Row Level Security on all tables with role-based policies
- [x] Auto-profile creation trigger on auth signup
- [x] Default permissions seed for all roles
- [x] Supabase session refresh in middleware
- [x] Auth pages: login, register, forgot password, callback
- [x] Server actions for sign in/up/out/reset
- [x] Session utilities and permission helpers
- [x] Data layer with Supabase + seed fallback (`src/lib/data/`)
- [x] Account page shows authenticated state
- [x] RLS and permission unit tests (20 total tests passing)
- [ ] Live Supabase project connection (requires user credentials)
- [ ] Full catalog seed via service role (after auth users created)

## Milestone 4: Seller Portal ✅

- [x] Seller portal layout with sidebar navigation
- [x] Auth guards (`requireApprovedSeller`, application flow)
- [x] Seller application form with validation and status tracking
- [x] Seller dashboard with stats, alerts, recent orders
- [x] Store profile management
- [x] Product list, create, and edit with status workflow
- [x] Inventory page with low-stock alerts
- [x] Orders list and fulfilment actions (accept → ship → deliver)
- [x] Sales analytics and payout history views
- [x] Seller settings page
- [x] Mock data layer for development without Supabase
- [x] Unit tests for seller mock data (25 total tests passing)

## Milestone 5: Administration ✅

- [x] Admin portal layout with sidebar navigation and role-based nav
- [x] Auth guards (`requireAdmin`, `requireSuperAdmin`)
- [x] Admin dashboard with stats, alerts, recent orders, audit activity
- [x] Seller application review (approve/reject with confirmation)
- [x] Seller management (view, suspend, reactivate)
- [x] Product moderation queue (approve/reject)
- [x] Category management (create/update)
- [x] Platform orders view
- [x] Commission settings (super-admin action)
- [x] Homepage CMS section toggles (mock until CMS tables migrated)
- [x] Audit log viewer with action recording
- [x] Platform settings and roles reference pages
- [x] Mock data layer for development without Supabase
- [x] Unit tests for admin mock data (31 total tests passing)

## Milestone 6: Commerce Completion ✅

- [x] Payment provider factory (mock default; Stripe/PayPal stub with fallback)
- [x] Payment webhook route scaffold (`/api/webhooks/payments`)
- [x] Multi-vendor order splitting with per-seller commission calculation
- [x] Checkout server action with order persistence (mock store + Supabase service role)
- [x] Notification abstraction (mock email + in-app notifications)
- [x] Order confirmation and seller new-order notifications
- [x] Customer order history and order detail pages
- [x] Returns request flow (customer) and approval/refund flow (admin)
- [x] DB migration: payments, notifications, returns, refunds
- [x] Analytics provider factory (mock, Plausible, Google stubs)
- [x] Wired checkout_started, product_viewed, search_submitted events
- [x] Unit tests for order splitting (35 total tests passing)
- [ ] Real Stripe/PayPal adapters (blocked on OPEN_DECISIONS #3)
- [ ] Payout ledger and scheduled payouts (blocked on OPEN_DECISIONS #8)

## Milestone 7: Quality & Release ✅

- [x] Full E2E test suite (10 critical scenarios + platform/a11y coverage)
- [x] Accessibility audit automation (axe-core + Playwright on key pages)
- [x] Security review documented + header tests (unit + E2E)
- [x] HSTS enabled in production middleware
- [x] Performance guidance and Lighthouse runbook (`docs/PERFORMANCE.md`)
- [x] PWA validation (manifest, icons, offline page, service worker E2E)
- [x] Deployment runbook (`docs/DEPLOYMENT.md`)
- [x] CI uploads Playwright report on failure
- [ ] Production Supabase + Vercel setup (requires user credentials)

## Known issues / tech debt

- Account sub-pages (addresses, security) are shells
- Checkout persists orders via mock payment adapter (real provider pending decision #3)
- CSP uses `unsafe-inline`/`unsafe-eval` — harden before strict security audit
- Supabase env vars optional for local seed-data development
- Production Supabase + Vercel connection documented in `docs/DEPLOYMENT.md` — requires user setup
