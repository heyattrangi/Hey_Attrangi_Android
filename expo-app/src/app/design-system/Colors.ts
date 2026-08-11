/**
 * Hey Attrangi — Production Color Tokens
 * Production Web Brand Palette: warm orange continuous-care aesthetic.
 * Sourced from app-heyattrangi/app/globals.css
 */

export const Colors = {
  // Brand (Web: --color-brand #E8722A / #f97316)
  primary: '#E8722A',
  primaryLight: '#FFF3E8',
  primaryGlow: 'rgba(232, 114, 42, 0.18)',
  primaryDark: '#C05C1A',
  primaryDisabled: '#C4C4C4',

  // Secondary / neutrals
  secondary: '#666666',
  secondaryLight: '#C4C4C4',
  divider: '#E8E0D8',
  borderDefault: '#E8E0D8',
  borderFocused: '#E8722A',
  borderStrong: '#C8C0B8',

  // Text (Web: --color-text-primary #1A1A2E)
  textPrimary: '#1A1A2E',
  textSecondary: '#666666',
  textMuted: '#999999',
  textWhite: '#FFFFFF',
  textAccent: '#E8722A',

  // Surfaces (Web: --color-bg #F9F5F0, --color-surface #FFFFFF)
  background: '#F9F5F0',
  surface: '#FFFFFF',
  surfaceRaised: '#FFF8F4',
  peachLight: '#FFE8CC',
  peachMuted: '#FFF5E6',
  calendarInactive: '#F0F0F0',

  // Accents (Web: --color-accent #1A6B6B / #0fb69a)
  accentTeal: '#1A6B6B',
  accentCalm: '#0fb69a',
  accentSoft: '#E8F5F5',
  accentPurple: '#7C5CBF',
  accentYellow: '#E8722A',
  confirmedGreen: '#0F6E56',
  badgeGreen: '#E6F7F1',

  // Semantic (Web globals.css)
  success: '#0F6E56',
  warning: '#C8A800',
  error: '#C0392B',
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
  shadowWarm: 'rgba(232, 114, 42, 0.15)',
} as const;

export type ColorToken = keyof typeof Colors;
