import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiStore, BannerType } from '../../store/uiStore';
import { Colors, Radius, Spacing, Typography, Elevation, Motion } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

const BG: Record<BannerType, string> = {
  success: Colors.confirmedGreen,
  error: Colors.error,
  warning: Colors.primary,
  info: Colors.info,
};

/**
 * Success / error / warning / info banner — store-driven host.
 */
export const FeedbackBanner = memo(() => {
  const insets = useSafeAreaInsets();
  const banner = useUiStore((s) => s.banner);
  const hideBanner = useUiStore((s) => s.hideBanner);

  if (!banner) return null;

  return (
    <View
      style={[styles.wrap, { top: insets.top + Spacing.sm + 44 }]}
      accessibilityRole="alert"
      accessibilityLabel={banner.message}
    >
      <View style={[styles.banner, { backgroundColor: BG[banner.type] }]}>
        <Text style={styles.text} maxFontSizeMultiplier={1.3}>
          {banner.message}
        </Text>
        <TouchableOpacity
          onPress={hideBanner}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y('Dismiss')}
        >
          <Text style={styles.dismiss}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

FeedbackBanner.displayName = 'FeedbackBanner';

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: Elevation.max - 1,
  },
  banner: {
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
    flex: 1,
  },
  dismiss: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },
});
