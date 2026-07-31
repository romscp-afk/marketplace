# Architecture

## Overview

The marketplace is a Next.js App Router application with a domain-oriented module structure. Business logic is separated from UI so it can be reused by future native iOS/Android apps via shared API routes.

## Layers

```
┌─────────────────────────────────────────────┐
│  Pages (App Router)                         │
│  Server Components + Client Components      │
├─────────────────────────────────────────────┤
│  Components (UI, Layout, Product, PWA)      │
├─────────────────────────────────────────────┤
│  Contexts (Cart, Wishlist — client state)   │
├─────────────────────────────────────────────┤
│  Services / Lib (Analytics, Payments, etc.) │
├─────────────────────────────────────────────┤
│  Data (Seed → Supabase in Milestone 3)      │
├─────────────────────────────────────────────┤
│  Supabase (PostgreSQL, Auth, Storage, RLS)  │
└─────────────────────────────────────────────┘
```

## Key decisions

### Brand configuration
Centralized in `src/config/brand.ts`. CSS custom properties in `globals.css` map to Tailwind `@theme` tokens. Changing brand colours or name requires editing one file.

### State management
- **Cart & wishlist:** React Context + localStorage for guest persistence. Will merge with Supabase-backed cart on login (Milestone 3).
- **Server state:** Supabase queries in Server Components and Route Handlers.

### Provider abstractions
External services are behind interfaces:
- `src/lib/payments/types.ts` — Payment provider (mock active)
- `src/lib/analytics/index.ts` — Analytics (mock active)
- Notifications — To be added in Milestone 6

### Security model
- Row Level Security on all Supabase tables (Milestone 3)
- Server-side authorization checks on all mutations
- Service role key server-only (`src/lib/supabase/admin.ts`)
- No secrets in client bundles

### Multi-vendor orders
One parent marketplace order → multiple seller sub-orders. Platform collects payment, calculates commissions, allocates refunds per seller/item. Full implementation in Milestone 6.

### PWA
- Service worker caches static assets and public pages only
- Account, checkout, admin, and API responses are never cached
- Install prompt shown after engagement threshold, respects dismissal

## Directory conventions

- `src/app/` — Route segments mirror URL structure
- `src/components/ui/` — Accessible, reusable primitives
- `src/lib/` — Pure functions and service modules
- `src/types/` — Shared TypeScript interfaces
- `supabase/migrations/` — SQL migrations (Milestone 3)

## API strategy (future)

Route Handlers in `src/app/api/` will expose REST endpoints for:
- Mobile app consumption
- Webhook receivers (payments)
- Server-side mutations with authorization

All price calculations happen server-side. Client submits intent; server validates and computes totals.
