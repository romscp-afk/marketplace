# Accessibility (WCAG 2.2 AA)

Accessibility target and audit results for the Marketplace platform.

## Target

**WCAG 2.2 Level AA** — per `docs/ASSUMPTIONS.md`.

## Automated testing

| Tool | Scope | Command |
|------|-------|---------|
| ESLint jsx-a11y | Component lint | `npm run lint` |
| axe-core + Playwright | Key pages | `npm run test:e2e -- e2e/a11y.spec.ts` |

### Pages scanned (axe)

- Homepage (`/`)
- Search (`/search`)
- Cart (`/cart`)
- Login (`/account/login`)
- Checkout form labels (manual assertion)

Violations with **critical** or **serious** impact fail CI.

## Built-in patterns

| Pattern | Location |
|---------|----------|
| Visible labels on inputs | `src/components/ui/input.tsx` |
| `aria-invalid` + error announcements | Input, form server actions |
| `aria-busy` on loading buttons | `src/components/ui/button.tsx` |
| Screen reader labels | Header search, icon buttons |
| Skip / semantic landmarks | Layout header, main, nav |
| Focus visible styles | `src/app/globals.css` |
| Reduced motion | `prefers-reduced-motion` in globals |
| Dialog semantics | PWA install prompt |

## Manual audit checklist

Run before each major release:

- [ ] Keyboard-only navigation through checkout (Tab, Enter, Escape)
- [ ] Screen reader walkthrough: homepage → product → cart → checkout
- [ ] Color contrast on primary buttons and muted text (4.5:1 minimum)
- [ ] Form errors announced and associated with fields
- [ ] Mobile touch targets ≥ 44×44px on bottom navigation
- [ ] No information conveyed by color alone (status badges include text)
- [ ] Zoom to 200% without horizontal scroll on key pages

## Known gaps

| Gap | Priority | Plan |
|-----|----------|------|
| Skip-to-main link | Medium | Add to root layout |
| Live regions for cart updates | Medium | Announce add/remove in cart context |
| Full keyboard trap audit on modals | Low | Audit install prompt and future dialogs |

## Related

- [PERFORMANCE.md](./PERFORMANCE.md) — motion and reduced-motion overlap
- [DEPLOYMENT.md](./DEPLOYMENT.md) — release checklist includes a11y gate
