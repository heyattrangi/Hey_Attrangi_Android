import React, { memo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Colors, Motion, Radius, Shadows, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

export interface BillingConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel?: string;
  destructive?: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}

export const BillingConfirmDialog = memo<BillingConfirmDialogProps>(({
  visible,
  title,
  message,
  primaryLabel,
  secondaryLabel = 'Cancel',
  destructive,
  onPrimary,
  onSecondary,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onSecondary}
    statusBarTranslucent
  >
    <View style={styles.overlay} accessibilityViewIsModal>
      <Pressable style={StyleSheet.absoluteFill} onPress={onSecondary} />
      <View
        style={styles.card}
        accessibilityRole="alert"
        accessibilityLabel={`${title}. ${message}`}
      >
        <Text style={styles.title} maxFontSizeMultiplier={1.35}>
          {title}
        </Text>
        <Text style={styles.message} maxFontSizeMultiplier={1.4}>
          {message}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondary}
            onPress={onSecondary}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y(secondaryLabel)}
          >
            <Text style={styles.secondaryText}>{secondaryLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primary, destructive && styles.destructive]}
            onPress={onPrimary}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y(primaryLabel)}
          >
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
));

BillingConfirmDialog.displayName = 'BillingConfirmDialog';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  title: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  secondary: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.medium,
    minHeight: 44,
    justifyContent: 'center',
  },
  destructive: {
    backgroundColor: Colors.error,
  },
  primaryText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
