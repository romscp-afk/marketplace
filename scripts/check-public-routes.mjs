#!/usr/bin/env node
/** Verifies public footer and policy routes return 200 (run against built app or deployed URL). */
const base = process.env.APP_URL ?? "http://localhost:3000";

const routes = [
  "/help",
  "/help/returns",
  "/help/contact",
  "/about",
  "/careers",
  "/press",
  "/sustainability",
  "/sell/guidelines",
  "/sell/support",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/accessibility",
  "/legal/seller-policy",
  "/sellers",
];

const failures = [];

for (const route of routes) {
  const url = `${base}${route}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) failures.push(`${route} → ${res.status}`);
    else console.log(`✓ ${route}`);
  } catch (err) {
    failures.push(`${route} → ${err instanceof Error ? err.message : "error"}`);
  }
}

if (failures.length) {
  console.error("\nRoute check failures:");
  failures.forEach((f) => console.error(" ", f));
  process.exit(1);
}

console.log(`\nAll ${routes.length} public routes OK.`);
