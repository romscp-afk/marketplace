# Assumptions

## Business & legal
- Default currency is USD; final currency depends on target market (see OPEN_DECISIONS.md)
- Tax calculation is not implemented — requires jurisdiction-specific rules
- Commission default is 10%; final rate TBD by business stakeholders
- Delivery fees use flat rates; real shipping integration deferred
- Return eligibility is a per-product boolean; return window duration TBD
- Guest checkout is supported; account creation offered post-order

## Technical
- Temporary brand name "Marketplace" used throughout; will be replaced via brand config
- Seed data uses Unsplash images for development only
- Mock payment provider active until real provider selected
- Mock analytics and email providers active in development
- Supabase not required for Milestones 1–2; app runs with seed data
- Service role key never exposed to client
- PWA icons referenced as PNG; generate from brand assets before production

## UX
- Mobile-first with bottom navigation on viewports < md breakpoint
- WCAG 2.2 AA target; formal audit in Milestone 7
- Reduced motion respected via CSS media query
- PWA install prompt after 3 engagement events

## Roles (defined, enforcement in Milestone 3)
- guest, customer, seller_applicant, seller_owner, seller_staff
- marketplace_admin, super_admin, support_agent

## Data
- UUID primary keys throughout
- Soft deletion for products, sellers; hard retention for orders, payments, audit logs
- 32 seed products across 6 categories and 5 sellers
