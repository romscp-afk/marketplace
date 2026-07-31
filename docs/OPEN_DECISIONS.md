# Open Decisions

These business and technical decisions require stakeholder input before implementation.

## Business

| # | Decision | Impact | Status |
|---|----------|--------|--------|
| 1 | Final brand name | Brand config update only | Pending |
| 2 | Target country/market | Currency, tax, delivery, legal | Pending |
| 3 | Payment provider (Stripe, PayPal, local) | Payment integration | Pending |
| 4 | Tax calculation rules | Checkout totals, compliance | Pending |
| 5 | Delivery/shipping provider | Real-time shipping quotes | Pending |
| 6 | Commission structure | Seller payouts, pricing | Pending |
| 7 | Return window duration | Customer returns flow | Pending |
| 8 | Payout schedule (weekly, monthly) | Seller portal | Pending |
| 9 | Email provider (SendGrid, Resend) | Transactional email | Pending |
| 10 | SMS/notifications provider | Order updates | Pending |

## Technical

| # | Decision | Impact | Status |
|---|----------|--------|--------|
| 11 | Image CDN strategy | Product image delivery | Pending |
| 12 | Search engine (Supabase full-text vs Algolia) | Product discovery | Pending |
| 13 | Rate limiting implementation | API security | Pending |
| 14 | Analytics provider | Event tracking | Pending |

## Notes

- Do not implement real payment, tax, or payout integrations until decisions 2–8 are confirmed
- All external providers must remain behind abstraction interfaces
- Mark any placeholder UI clearly when a decision blocks functionality
