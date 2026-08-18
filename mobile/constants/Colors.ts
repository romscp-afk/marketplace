import { brand } from "@/lib/brand";

/** Mirrors src/config/brand.ts — keep in sync with web */
const palette = {
  text: brand.theme.colors.text,
  textSecondary: brand.theme.colors.textSecondary,
  background: brand.theme.colors.background,
  surface: brand.theme.colors.surface,
  tint: brand.theme.colors.primary,
  tabIconDefault: brand.theme.colors.textSecondary,
  tabIconSelected: brand.theme.colors.primary,
  border: brand.theme.colors.border,
  promotional: brand.theme.colors.promotional,
  error: brand.theme.colors.error,
};

export default {
  light: palette,
  dark: palette,
};
