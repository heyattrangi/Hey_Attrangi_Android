/**
 * Hey Attrangi — Motion Tokens
 * Calm, intentional timing for mental-health UX.
 */

export const Motion = {
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
    pulse: 3000,
    toast: 2800,
    shimmer: 1400,
  },

  easing: {
    standard: 'ease-in-out' as const,
    enter: 'ease-out' as const,
    exit: 'ease-in' as const,
  },

  scale: {
    press: 0.97,
    pulse: 1.04,
    pop: 1.02,
  },

  opacity: {
    hidden: 0,
    muted: 0.4,
    pressed: 0.8,
    visible: 1,
  },

  /**
   * Sprint 17 — use these presets so screens share calm timing.
   * Skip decorative motion when Reduce Motion is on (see useReducedMotion).
   */
  presets: {
    screenEnter: { duration: 250, easing: 'ease-out' as const },
    cardEnter: { duration: 250, easing: 'ease-out' as const },
    fade: { duration: 150, easing: 'ease-in-out' as const },
    sheet: { duration: 400, easing: 'ease-out' as const },
  },

  /** Prefer selection haptics for chips; success for completions only */
  haptics: {
    selection: 'selection' as const,
    success: 'success' as const,
    warning: 'warning' as const,
  },
} as const;

export type MotionDuration = keyof typeof Motion.duration;
