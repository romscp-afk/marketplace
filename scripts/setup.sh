#!/usr/bin/env bash
set -euo pipefail

echo "→ Setting up Marketplace platform..."

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✓ Created .env.local from .env.example"
else
  echo "✓ .env.local already exists"
fi

echo "→ Installing dependencies..."
npm install

echo "→ Verifying platform..."
npm run verify

echo ""
echo "Platform ready! Run 'npm run dev' to start developing."
echo ""
echo "Next steps:"
echo "  1. npm run dev          — start local server"
echo "  2. Visit /api/health    — check platform status"
echo "  3. See docs/SETUP.md    — connect Supabase, Vercel, GitHub"
