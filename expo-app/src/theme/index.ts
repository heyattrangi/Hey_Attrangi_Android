/**
 * Legacy theme barrel — re-exports Production Design System.
 * Prefer: `import { Colors, Theme } from '../app/design-system'`
 */

export {
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
  RadialGradients,
  LinearGradients,
  Motion,
  Icons,
  IconSizes,
  Theme,
  IconGuidelines,
  IllustrationGuidelines,
} from '../app/design-system';

export type {
  ColorToken,
  SpacingToken,
  RadiusToken,
  ElevationToken,
  GradientPreset,
  RadialGradientPreset,
  MotionDuration,
  IconKey,
  IconName,
  AppTheme,
} from '../app/design-system';
