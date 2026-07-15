import { useMemo } from 'react';
import { useWindowDimensions, PixelRatio } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type DeviceBucket =
  | 'phone_small'
  | 'phone'
  | 'phone_large'
  | 'tablet'
  | 'unknown';

/**
 * Responsive layout helpers — SE / Plus / Dynamic Island / tablet aware.
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const landscape = width > height;

  const bucket: DeviceBucket = useMemo(() => {
    const shortest = Math.min(width, height);
    if (shortest >= 768) return 'tablet';
    if (shortest <= 375) return 'phone_small'; // SE-class
    if (shortest >= 430) return 'phone_large'; // Plus / Pro Max class
    if (shortest > 0) return 'phone';
    return 'unknown';
  }, [width, height]);

  /** Dynamic Island / notch — treat tall top inset as island-class */
  const hasDynamicIsland = insets.top >= 54;
  const hasNotch = insets.top >= 44;

  const contentPadding = bucket === 'tablet' ? 32 : 16;
  const maxContentWidth = bucket === 'tablet' ? 720 : undefined;

  return {
    width,
    height,
    landscape,
    portrait: !landscape,
    bucket,
    insets,
    hasDynamicIsland,
    hasNotch,
    contentPadding,
    maxContentWidth,
    /** Soft pixel-ratio hint for image denseness */
    pixelRatio: PixelRatio.get(),
    isSmallPhone: bucket === 'phone_small',
    isTablet: bucket === 'tablet',
  };
}
