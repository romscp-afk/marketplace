# Performance (Core Web Vitals)

Performance targets and optimization notes for the Marketplace platform.

## Targets

| Metric | Good | Needs improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

Measure on production over real user traffic (Vercel Speed Insights or Google CrUX).

## Current optimizations

| Technique | Implementation |
|-----------|----------------|
| Static generation | Homepage, search, category pages pre-rendered where possible |
| Image optimization | Next.js `Image` component on product cards and PDP |
| Font loading | System font stack via Tailwind — no external font blocking |
| Code splitting | App Router automatic route-based splitting |
| PWA caching | Service worker caches static assets (production only) |
| ESLint Core Web Vitals | `eslint-config-next/core-web-vitals` in ESLint config |

## Lighthouse (local)

Run against production build for accurate results:

```bash
npm run build
npm run start
# In another terminal:
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices --view
```

## Pre-release performance checklist

- [ ] Lighthouse Performance score ≥ 90 on homepage (desktop)
- [ ] Lighthouse Performance score ≥ 80 on product detail (mobile)
- [ ] No layout shift on homepage hero or product grid load
- [ ] Cart add/remove responds within 200ms (client-side state)
- [ ] Checkout form steps transition without full page reload
- [ ] Review bundle size after adding new dependencies (`npm run build` output)

## Future optimizations

- Image CDN (OPEN_DECISIONS #11)
- Search index (Algolia vs Supabase full-text — OPEN_DECISIONS #12)
- Route prefetch tuning for seller/admin portals
- Server component streaming for large product grids

## Related

- [DEPLOYMENT.md](./DEPLOYMENT.md) — monitoring setup
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — reduced motion preferences
