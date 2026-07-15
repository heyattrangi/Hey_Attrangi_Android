/**
 * Hey Attrangi — Production Radius Scale
 * Soft, approachable roundness from design assets.
 */

export const Radius = {
  /** 4dp — micro elements */
  xs: 4,
  /** 8dp — tags, compact chips */
  small: 8,
  /** 10dp — OTP cells, compact grids */
  medium: 10,
  /** 12dp — inputs, avatars, small cards */
  large: 12,
  /** 16dp — mood cards, therapist cards */
  xlarge: 16,
  /** 20dp — session / home cards */
  card: 20,
  /** 24dp — bottom sheets, large panels */
  xxlarge: 24,
  /** Fully rounded — buttons, search, chips */
  pill: 50,
  /** Perfect circle */
  full: 9999,
} as const;

export type RadiusToken = keyof typeof Radius;

/** Alias for legacy BorderRadius imports */
export const BorderRadius = Radius;
