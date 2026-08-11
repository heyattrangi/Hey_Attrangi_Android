import { ViewStyle } from 'react-native';

/**
 * Hey Attrangi — Shadows & Elevation Tokens
 * Source of Truth: WEB_DESIGN_SYSTEM_AUDIT.md
 */

export const Shadows: Record<string, ViewStyle> = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 6,
  },
  brandGlow: {
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 4,
  },
  primaryCta: {
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
};

export type ShadowToken = keyof typeof Shadows;
