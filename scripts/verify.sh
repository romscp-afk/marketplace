#!/usr/bin/env bash
set -euo pipefail

echo "→ Linting..."
npm run lint

echo "→ Type checking..."
npm run typecheck

echo "→ Running unit tests..."
npm run test

echo "→ Building..."
npm run build

echo ""
echo "✓ All checks passed — platform is healthy."
