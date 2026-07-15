import React, { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiStore } from '../../store/uiStore';
import { Colors, Typography, Radius, Spacing, Elevation, Icons } from '../../app/design-system';
import { Icon } from '../app/Icon';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  /** When omitted, reads from uiStore (global toast host). */
  message?: string | null;
  type?: ToastType;
  style?: ViewStyle;
}

const TOAST_BG: Record<ToastType, string> = {
  success: Colors.confirmedGreen,
  error: Colors.error,
  info: Colors.info,
  warning: Colors.primary,
};

export const Toast = memo<ToastProps>(({ message: messageProp, type: typeProp, style }) => {
  const insets = useSafeAreaInsets();
  const storeMessage = useUiStore((s) => s.toastMessage);
  const storeType = useUiStore((s) => s.toastType);

  const message = messageProp !== undefined ? messageProp : storeMessage;
  const type = (typeProp ?? storeType) as ToastType;

  if (!message) return null;

  const bg = TOAST_BG[type] ?? Colors.confirmedGreen;
  const iconName =
    type === 'error' || type === 'warning'
      ? Icons.alert
      : type === 'info'
        ? Icons.alertOutline
        : Icons.checkCircle;

  return (
    <View
      style={[styles.container, { top: insets.top + Spacing.sm }, style]}
      pointerEvents="none"
    >
      <View style={[styles.banner, { backgroundColor: bg }]}>
        <Icon name={iconName} size={20} color={Colors.white} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
});

Toast.displayName = 'Toast';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: Elevation.max,
    elevation: Elevation.max,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
    flex: 1,
  },
});
