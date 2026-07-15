import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import { Image, ImageContentFit, ImageSource } from 'expo-image';
import { Colors, Radius } from '../../app/design-system';
import { Icon } from './Icon';
import { decorativeImageA11y } from '../../utils/accessibility';

export type AppImageAspect = '1:1' | '4:3' | '16:9' | '3:4' | number;

export interface AppImageProps {
  source: ImageSource | number | string | null | undefined;
  /** Meaningful images need a label; omit for decorative */
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  /** Width / height ratio — e.g. 1, 16/9, or named */
  aspectRatio?: AppImageAspect;
  borderRadius?: number;
  /** Show loading indicator overlay while loading */
  showPlaceholder?: boolean;
  recyclingKey?: string;
  fallbackIcon?: string;
  testID?: string;
}

function resolveAspect(ratio?: AppImageAspect): number | undefined {
  if (ratio == null) return undefined;
  if (typeof ratio === 'number') return ratio;
  switch (ratio) {
    case '1:1':
      return 1;
    case '4:3':
      return 4 / 3;
    case '16:9':
      return 16 / 9;
    case '3:4':
      return 3 / 4;
    default:
      return 1;
  }
}

function toSource(
  source: AppImageProps['source'],
): ImageSource | number | null {
  if (source == null || source === '') return null;
  if (typeof source === 'string') return { uri: source };
  return source as ImageSource | number;
}

/**
 * Production image primitive — disk/memory cache, fade-in, placeholder,
 * error fallback, optional aspect lock.
 */
export const AppImage = memo<AppImageProps>(
  ({
    source,
    accessibilityLabel,
    style,
    containerStyle,
    contentFit = 'cover',
    aspectRatio,
    borderRadius = Radius.large,
    showPlaceholder = true,
    recyclingKey,
    fallbackIcon = 'image-off-outline',
    testID,
  }) => {
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const resolved = toSource(source);
    const aspect = resolveAspect(aspectRatio);

    const a11y = useMemo(
      () =>
        accessibilityLabel
          ? {
              accessible: true as const,
              accessibilityRole: 'image' as const,
              accessibilityLabel,
            }
          : decorativeImageA11y,
      [accessibilityLabel],
    );

    const onLoadStart = useCallback(() => {
      setLoading(true);
      setFailed(false);
    }, []);

    return (
      <View
        style={[
          styles.wrap,
          { borderRadius },
          aspect != null ? { aspectRatio: aspect } : null,
          containerStyle,
        ]}
        testID={testID}
      >
        {failed || !resolved ? (
          <View
            style={[styles.fallback, { borderRadius }]}
            {...(accessibilityLabel
              ? {
                  accessible: true,
                  accessibilityLabel: `${accessibilityLabel}, unavailable`,
                }
              : decorativeImageA11y)}
          >
            <Icon name={fallbackIcon} size={28} color={Colors.textMuted} />
          </View>
        ) : (
          <Image
            source={resolved}
            style={[styles.image, { borderRadius }, style]}
            contentFit={contentFit}
            transition={200}
            cachePolicy="memory-disk"
            recyclingKey={recyclingKey}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            onLoadStart={onLoadStart}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
            {...a11y}
          />
        )}
        {showPlaceholder && loading && !failed && resolved ? (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : null}
      </View>
    );
  },
);

AppImage.displayName = 'AppImage';

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: Colors.calendarInactive,
    position: 'relative',
    minHeight: 48,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.calendarInactive,
    minHeight: 64,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,247,245,0.55)',
  },
});
