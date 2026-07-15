import React, { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import {
  useErrorManagerStore,
  ErrorManager,
} from '../../platform/ErrorManager';
import { useAppConfigStore } from '../../store/appConfigStore';
import { buttonA11y } from '../../utils/accessibility';

/**
 * Global modal for ErrorManager.present(..., { presentation: 'modal' }).
 */
export const GlobalErrorHost = memo(() => {
  const active = useErrorManagerStore((s) => s.active);
  const enabled = useAppConfigStore((s) =>
    s.isFlagEnabled('enableGlobalErrorModal'),
  );

  if (!enabled || !active) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={() => ErrorManager.dismiss()}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => ErrorManager.dismiss()}
        {...buttonA11y('Dismiss error')}
      >
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <Text style={styles.title} accessibilityRole="header">
            {active.title}
          </Text>
          <Text style={styles.body} maxFontSizeMultiplier={1.35}>
            {active.message}
          </Text>
          {active.retryable ? (
            <PrimaryButton
              label="Retry"
              onPress={() => useErrorManagerStore.getState().retry()}
            />
          ) : null}
          <SecondaryButton
            label="Dismiss"
            onPress={() => ErrorManager.dismiss()}
            style={styles.secondary}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
});

GlobalErrorHost.displayName = 'GlobalErrorHost';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxlarge,
    padding: Spacing.xl,
    ...Shadows.medium,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  secondary: { marginTop: Spacing.xs },
});
