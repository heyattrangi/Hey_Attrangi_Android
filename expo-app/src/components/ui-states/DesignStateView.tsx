import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
} from '../../app/design-system';
import { RadialGradientBackground } from '../ui/RadialGradientBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { UiStateDefinition } from '../../app/ui-states';

export interface DesignStateViewProps {
  definition: UiStateDefinition;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /** Override catalog illustration */
  illustration?: ImageSourcePropType;
  style?: ViewStyle;
  /** Extra content below message (e.g. booking details card) */
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Full-screen Design-folder state: glow + illustration + copy + optional CTA.
 * Matches Figma empty/error/success layouts.
 */
export const DesignStateView = memo<DesignStateViewProps>(({
  definition,
  onPrimaryAction,
  onSecondaryAction,
  illustration,
  style,
  children,
  footer,
}) => {
  const insets = useSafeAreaInsets();
  const image = illustration ?? definition.illustration;
  const primaryLabel = definition.primaryActionLabel;
  const secondaryLabel = definition.secondaryActionLabel;
  const showPrimary = Boolean(primaryLabel && onPrimaryAction);
  const showSecondary = Boolean(secondaryLabel && onSecondaryAction);

  return (
    <View style={[styles.root, style]}>
      <RadialGradientBackground preset="topRightWarm" />
      <View style={styles.center}>
        {image ? (
          <Image
            source={image}
            style={styles.illustration}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        ) : null}
        {definition.title ? (
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {definition.title}
          </Text>
        ) : null}
        {definition.message ? (
          <Text style={styles.message} maxFontSizeMultiplier={1.3}>
            {definition.message}
          </Text>
        ) : null}
        {children}
      </View>

      {(showPrimary || showSecondary || footer) ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
          {footer}
          {showPrimary ? (
            <PrimaryButton
              label={primaryLabel!}
              onPress={onPrimaryAction!}
              showArrow={definition.showArrow}
              style={styles.primaryBtn}
            />
          ) : null}
          {showSecondary ? (
            <SecondaryButton
              label={secondaryLabel!}
              onPress={onSecondaryAction!}
              size="full"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

DesignStateView.displayName = 'DesignStateView';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    minHeight: 320,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  illustration: {
    width: 220,
    height: 200,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: Spacing.md,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  primaryBtn: {
    borderRadius: Radius.large,
  },
});
