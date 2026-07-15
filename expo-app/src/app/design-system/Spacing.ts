/**
 * Hey Attrangi — Production Spacing Scale
 * 4dp base grid for margins, padding, and gaps.
 */

export const Spacing = {
  /** 4dp — tight helper gaps, icon offsets */
  xs: 4,
  /** 8dp — compact content margins */
  sm: 8,
  /** 12dp — chip / tag gaps */
  md12: 12,
  /** 16dp — list item spacing, field padding */
  md: 16,
  /** 20dp — card inner padding */
  md20: 20,
  /** 24dp — screen horizontal edges */
  lg: 24,
  /** 32dp — section vertical rhythm */
  xl: 32,
  /** 48dp — header / major offsets */
  xxl: 48,
  /** 64dp — large empty-state padding */
  xxxl: 64,
} as const;

export type SpacingToken = keyof typeof Spacing;
