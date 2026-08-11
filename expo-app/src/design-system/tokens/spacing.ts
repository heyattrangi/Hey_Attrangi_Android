/**
 * Hey Attrangi — Spacing Tokens
 * Source of Truth: WEB_DESIGN_SYSTEM_AUDIT.md
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  mobilePagePadding: 16,
} as const;

export type SpacingToken = keyof typeof Spacing;
