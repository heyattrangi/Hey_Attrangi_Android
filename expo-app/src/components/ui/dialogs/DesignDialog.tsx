import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal as RNModal,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Elevation,
} from '../../../app/design-system';
import { RadialGradientBackground } from '../RadialGradientBackground';
import { UiStateDefinition } from '../../../app/ui-states';

export interface DesignDialogProps {
  visible: boolean;
  definition: UiStateDefinition;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onDismiss?: () => void;
  illustration?: ImageSourcePropType;
  /** Title color — orange for success dialogs like Password Changed / Session Cancelled */
  accentTitle?: boolean;
}

/**
 * Centered confirmation/success dialog matching Design folder overlays
 * (Logout, Discard Changes, Cancel Session, Password Changed, Session Cancelled).
 */
export const DesignDialog = memo<DesignDialogProps>(({
  visible,
  definition,
  onPrimaryAction,
  onSecondaryAction,
  onDismiss,
  illustration,
  accentTitle = false,
}) => {
  const image = illustration ?? definition.illustration;
  const primaryLabel = definition.primaryActionLabel;
  const secondaryLabel = definition.secondaryActionLabel;
  const isSingleAction = Boolean(primaryLabel && !secondaryLabel);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss ?? onSecondaryAction}
      statusBarTranslucent
    >
      <View style={styles.overlay} accessibilityViewIsModal>
        <RadialGradientBackground preset="topRightSoft" />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss ?? onSecondaryAction}
          accessibilityRole="button"
          accessibilityLabel="Dismiss dialog"
        />
        <View
          style={styles.card}
          accessibilityRole="alert"
          accessibilityLabel={[definition.title, definition.message].filter(Boolean).join('. ')}
        >
          {definition.title ? (
            <Text
              style={[styles.title, accentTitle && styles.titleAccent]}
              maxFontSizeMultiplier={1.3}
            >
              {definition.title}
            </Text>
          ) : null}
          {definition.message ? (
            <Text style={styles.message} maxFontSizeMultiplier={1.3}>
              {definition.message}
            </Text>
          ) : null}
          {image ? (
            <Image
              source={image}
              style={styles.illustration}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          ) : null}

          {isSingleAction ? (
            <Pressable
              style={styles.singlePrimary}
              onPress={onPrimaryAction}
              accessibilityRole="button"
              accessibilityLabel={primaryLabel}
            >
              <Text style={styles.singlePrimaryText}>{primaryLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.row}>
              {primaryLabel && onPrimaryAction ? (
                <Pressable
                  style={[styles.rowBtn, styles.rowPrimary]}
                  onPress={onPrimaryAction}
                  accessibilityRole="button"
                  accessibilityLabel={primaryLabel}
                >
                  <Text style={styles.rowPrimaryText} numberOfLines={2}>
                    {primaryLabel}
                  </Text>
                </Pressable>
              ) : null}
              {secondaryLabel && onSecondaryAction ? (
                <Pressable
                  style={[styles.rowBtn, styles.rowSecondary]}
                  onPress={onSecondaryAction}
                  accessibilityRole="button"
                  accessibilityLabel={secondaryLabel}
                >
                  <Text style={styles.rowSecondaryText} numberOfLines={2}>
                    {secondaryLabel}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
});

DesignDialog.displayName = 'DesignDialog';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxlarge,
    padding: Spacing.xl,
    alignItems: 'center',
    zIndex: Elevation.overlay,
    ...Shadows.high,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  titleAccent: {
    color: Colors.primary,
    fontWeight: '700',
  },
  message: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  illustration: {
    width: 140,
    height: 120,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  rowBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radius.large,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  rowPrimary: {
    backgroundColor: Colors.primary,
  },
  rowSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  rowPrimaryText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  rowSecondaryText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  singlePrimary: {
    minHeight: 48,
    minWidth: 160,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.large,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singlePrimaryText: {
    ...Typography.buttonText,
    color: Colors.textWhite,
  },
});
