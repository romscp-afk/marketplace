#!/usr/bin/env bash
# Provision Supabase via Vercel Marketplace, push migrations, and redeploy.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "→ Provisioning Supabase (Singapore region) via Vercel Marketplace..."
npx vercel integration add supabase \
  --name marketplace-db \
  -m region=sin1 \
  -e production \
  -e preview \
  --format json

echo "→ Pulling environment variables from Vercel..."
npx vercel env pull .env.local --yes

echo "→ Pushing database migrations..."
DB_URL="${POSTGRES_URL_NON_POOLING:-${POSTGRES_URL:-}}"
if [[ -n "$DB_URL" ]]; then
  npx supabase db push --db-url "$DB_URL"
else
  echo "⚠ POSTGRES_URL not found — run: npx supabase link && npm run db:push"
fi

echo "→ Redeploying production..."
npx vercel deploy --prod --yes

echo ""
echo "✓ Supabase connected. Check: https://aromza.store/api/health"
