export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatSoldCount(reviewCount: number): string {
  const sold = Math.max(reviewCount * 4 + 12, 1);
  if (sold >= 1000) return `${(sold / 1000).toFixed(1)}k sold`;
  return `${sold} sold`;
}

export function flashSaleEndsAt(): Date {
  const now = new Date();
  const end = new Date(now);
  end.setHours(now.getHours() + 2, 0, 0, 0);
  if (end <= now) end.setHours(end.getHours() + 2);
  return end;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function showFreeShippingBadge(price: number, deliveryFee?: number): boolean {
  return price >= 25 || deliveryFee === 0 || deliveryFee === undefined;
}
