import React, { memo } from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors, Typography } from '../../app/design-system';
import { useFontScale } from '../../i18n/typographyScale';
import { usePreferencesStore } from '../../store/preferencesStore';

type Variant = keyof typeof Typography;

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  /** Override dynamic scaling cap */
  maxScale?: number;
}

/**
 * Text that respects Appearance font size + system Dynamic Type caps.
 * Prefer this over raw Text for product copy.
 */
export const AppText = memo<AppTextProps>(
  ({
    variant = 'body',
    color,
    style,
    maxScale,
    maxFontSizeMultiplier,
    children,
    ...rest
  }) => {
    const { maxFontSizeMultiplier: prefMax, scale } = useFontScale();
    const highContrast = usePreferencesStore(
      (s: { appearance: { highContrast: boolean } }) => s.appearance.highContrast,
    );
    const base = Typography[variant] as TextStyle;
    const scaled: StyleProp<TextStyle> = [
      base,
      {
        color:
          color ??
          (highContrast ? Colors.textPrimary : (base as TextStyle).color) ??
          Colors.textPrimary,
        fontSize: base.fontSize
          ? Math.round((base.fontSize as number) * scale)
          : undefined,
        lineHeight: base.lineHeight
          ? Math.round((base.lineHeight as number) * scale)
          : undefined,
      },
      highContrast ? styles.hc : null,
      style,
    ];

    return (
      <Text
        {...rest}
        style={scaled}
        maxFontSizeMultiplier={maxFontSizeMultiplier ?? maxScale ?? prefMax}
      >
        {children}
      </Text>
    );
  },
);

AppText.displayName = 'AppText';

const styles = StyleSheet.create({
  hc: {
    // Slight weight bump aids high-contrast readability without new colors
    fontWeight: '600',
  },
});
