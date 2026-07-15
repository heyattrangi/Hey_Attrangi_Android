import { Colors } from './Colors';
import { Typography, FontFamily, FontSize, LineHeight } from './Typography';
import { Spacing } from './Spacing';
import { Radius, BorderRadius } from './Radius';
import { Elevation } from './Elevation';
import { Shadows } from './Shadows';
import { Gradients } from './Gradients';
import { Motion } from './Motion';
import { Icons, IconSizes } from './Icons';

/**
 * Icon guidelines — standard visual symbol metrics.
 */
export const IconGuidelines = {
  navigationSize: IconSizes.lg,
  buttonSize: IconSizes.md,
  strokeWidth: 2.5,
  activeColor: Colors.textPrimary,
  inactiveColor: Colors.textSecondary,
};

/**
 * Illustration guidelines — ambient glow + pulse for onboarding/chat.
 */
export const IllustrationGuidelines = {
  glowSize: 200,
  pulseScale: Motion.scale.pulse,
  pulseDuration: Motion.duration.pulse,
  glowColor: Colors.primaryGlow,
};

/**
 * Unified production theme object.
 */
export const Theme = {
  Colors,
  Typography,
  FontFamily,
  FontSize,
  LineHeight,
  Spacing,
  Radius,
  BorderRadius,
  Elevation,
  Shadows,
  Gradients,
  Motion,
  Icons,
  IconSizes,
  IconGuidelines,
  IllustrationGuidelines,
} as const;

export type AppTheme = typeof Theme;
