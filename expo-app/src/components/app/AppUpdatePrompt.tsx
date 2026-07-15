import React, { memo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useAppConfigStore } from '../../store/appConfigStore';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { Colors, Radius, Spacing, Typography, Elevation } from '../../app/design-system';
import { APP_VERSION, envLink } from './updateMeta';

export const AppUpdatePrompt = memo(() => {
  const requiresForceUpdate = useAppConfigStore((s) => s.requiresForceUpdate);
  const hasOptionalUpdate = useAppConfigStore((s) => s.hasOptionalUpdate);
  const dismissUpdate = useAppConfigStore((s) => s.dismissUpdate);

  const force = requiresForceUpdate();
  const optional = !force && hasOptionalUpdate();

  if (!force && !optional) return null;

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <View style={styles.card} accessibilityRole="alert">
        <Text style={styles.title}>
          {force ? 'Update required' : 'Update available'}
        </Text>
        <Text style={styles.message} maxFontSizeMultiplier={1.4}>
          {force
            ? `This version of Hey Attrangi (${APP_VERSION}) is no longer supported. Please update to continue.`
            : `A newer version of Hey Attrangi is available. You're on v${APP_VERSION}.`}
        </Text>
        <PrimaryButton
          label="Update"
          onPress={() => {
            void Linking.openURL(envLink()).catch(() => undefined);
          }}
        />
        {!force ? (
          <SecondaryButton label="Not now" onPress={dismissUpdate} />
        ) : null}
      </View>
    </View>
  );
});

AppUpdatePrompt.displayName = 'AppUpdatePrompt';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing.xl,
    zIndex: Elevation.max,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
