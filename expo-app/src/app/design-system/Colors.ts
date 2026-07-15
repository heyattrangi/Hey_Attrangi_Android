/**
 * Hey Attrangi — Production Color Tokens
 * Brand: warm orange continuous-care aesthetic from design PNGs.
 */

export const Colors = {
  // Brand
  primary: '#F5A623',
  primaryLight: 'rgba(245, 166, 35, 0.12)',
  primaryGlow: 'rgba(245, 166, 35, 0.18)',
  primaryDark: '#D47500',
  primaryDisabled: '#C4C4C4',

  // Secondary / neutrals
  secondary: '#666666',
  secondaryLight: '#C4C4C4',
  divider: '#CCCCCC',
  borderDefault: '#E2E8F0',
  borderFocused: '#F5A623',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textWhite: '#FFFFFF',
  textAccent: '#F5A623',

  // Surfaces
  background: '#F7F7F5',
  surface: '#FFFFFF',
  peachLight: '#FFE8CC',
  peachMuted: '#FFF5E6',
  calendarInactive: '#F0F0F0',

  // Accents
  accentPurple: '#7C5CBF',
  accentYellow: '#F5A623',
  confirmedGreen: '#38A169',
  badgeGreen: '#D9F99D',

  // Semantic
  success: '#38A169',
  warning: '#F5A623',
  error: '#E53E3E',
  info: '#3182CE',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.45)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  // Basics
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  /** Google brand blue — Sign-in CTA lettermark (approved partner brand) */
  brandGoogle: '#4285F4',
  /** Soft warm shadow tint for selection elevation (Design cards) */
  shadowWarm: 'rgba(212, 165, 116, 0.35)',
} as const;

export type ColorToken = keyof typeof Colors;
