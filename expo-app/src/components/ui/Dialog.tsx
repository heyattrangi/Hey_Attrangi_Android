import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { Modal } from './Modal';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

export interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const Dialog = memo<DialogProps>(({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) => (
  <Modal visible={visible} onClose={onCancel}>
    <Text style={styles.title} maxFontSizeMultiplier={1.3}>
      {title}
    </Text>
    {message ? (
      <Text style={styles.message} maxFontSizeMultiplier={1.3}>
        {message}
      </Text>
    ) : null}
    <View style={styles.actions}>
      <SecondaryButton
        label={cancelLabel}
        onPress={onCancel}
        size="full"
        style={styles.actionBtn}
      />
      <PrimaryButton
        label={confirmLabel}
        onPress={onConfirm}
        style={{
          ...styles.actionBtn,
          ...(destructive ? styles.destructive : null),
        }}
      />
    </View>
  </Modal>
));

Dialog.displayName = 'Dialog';

const styles = StyleSheet.create({
  title: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  actions: {
    gap: Spacing.xs,
  },
  actionBtn: {
    marginVertical: Spacing.xs,
  },
  destructive: {
    backgroundColor: Colors.error,
  },
});
