/**
 * Hey Attrangi — Centralized Color Tokens
 * Source of Truth: WEB_DESIGN_SYSTEM_AUDIT.md & app-heyattrangi/app/globals.css
 */

export const Colors = {
  // Brand
  brandPrimary: '#E8722A',
  brandCoral: '#FF7D5C',
  brandNavy: '#0E3D60',
  skyBlue: '#8ECCE7',
  brandOrange500: '#f97316',
  brandAmber500: '#f59e0b',
  brandLight: '#FFF3E8',
  brandDark: '#C05C1A',
  brandDarkOrange: '#ea580c',
  brandGlow: 'rgba(232, 114, 42, 0.18)',

  // Neutrals / Backgrounds
  background: '#F9F5F0',
  canvas: '#fdf6f0',
  surface: '#FFFFFF',
  surfaceRaised: '#FFF8F4',
  peachLight: '#FFE8CC',
  peachMuted: '#FFF5E6',
  calendarInactive: '#F0F0F0',

  // Text
  textPrimary: '#1A1A2E',
  textInk: '#14213d',
  textSecondary: '#666666',
  textMuted: '#999999',
  textSubtle: '#64748b',
  textWhite: '#FFFFFF',
  textAccent: '#E8722A',

  // Borders & Hairlines
  borderDefault: '#E8E0D8',
  borderStrong: '#C8C0B8',
  borderFocused: '#E8722A',
  hairline: '#ede4db',

  // Accents
  accentTeal: '#1A6B6B',
  accentCalm: '#0fb69a',
  accentLight: '#E8F5F5',
  accentSoft: '#e6f7f1',
  accentPurple: '#7C5CBF',

  // Semantic
  success: '#0F6E56',
  warning: '#C8A800',
  error: '#C0392B',
  info: '#3182CE',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.45)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  // Brand Partner
  brandGoogle: '#4285F4',

  // Basics
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof Colors;
