import { brand } from "./brand";

export function formatCurrency(
  amount: number,
  currency: string = brand.locale.currency,
  locale: string = brand.locale.default,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
