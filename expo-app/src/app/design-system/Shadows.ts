import { ViewStyle } from 'react-native';
import { Elevation } from './Elevation';

/**
 * Hey Attrangi — Shadow Presets
 * Soft drop shadows matching design PNG card depth.
 */

type ShadowStyle = ViewStyle;

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: Elevation.none,
  } as ShadowStyle,

  low: {
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: Elevation.low,
  } as ShadowStyle,

  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: Elevation.medium,
  } as ShadowStyle,

  high: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: Elevation.high,
  } as ShadowStyle,

  overlay: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: Elevation.overlay,
  } as ShadowStyle,
} as const;
