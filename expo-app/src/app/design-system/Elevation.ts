/**
 * Hey Attrangi — Elevation Levels
 * Semantic depth scale mapped to platform shadow/elevation.
 */

export const Elevation = {
  none: 0,
  /** Inputs, chips, subtle lifts */
  low: 1,
  /** Cards, floating panels */
  medium: 2,
  /** Sheets, dialogs, sticky bars */
  high: 4,
  /** Modals, toasts above content */
  overlay: 8,
  /** Absolute top (global toast) */
  max: 10,
} as const;

export type ElevationToken = keyof typeof Elevation;
