import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppConfigStore } from '../../store/appConfigStore';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { APP_NAME } from '../../constants/appMeta';

interface Props {
  children: React.ReactNode;
}

export const MaintenanceGate = memo<Props>(({ children }) => {
  const maintenanceMode = useAppConfigStore((s) => s.maintenanceMode);
  const message = useAppConfigStore((s) => s.maintenanceMessage);

  if (!maintenanceMode) return <>{children}</>;

  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel="Maintenance mode"
    >
      <Text style={styles.brand}>{APP_NAME}</Text>
      <Text style={styles.title}>We'll be right back</Text>
      <Text style={styles.message} maxFontSizeMultiplier={1.4}>
        {message}
      </Text>
    </View>
  );
});

MaintenanceGate.displayName = 'MaintenanceGate';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  brand: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
