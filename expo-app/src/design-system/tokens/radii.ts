/**
 * Hey Attrangi — Border Radius Tokens
 * Source of Truth: WEB_DESIGN_SYSTEM_AUDIT.md
 */

export const Radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  hero: 28,
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof Radii;
