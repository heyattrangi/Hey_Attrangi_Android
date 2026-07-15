import React, { memo } from 'react';
import {
  StyleSheet,
  Modal as RNModal,
  View,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Shadows, Elevation } from '../../app/design-system';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Dismiss when tapping the dimmed backdrop */
  dismissOnBackdrop?: boolean;
  contentStyle?: ViewStyle;
}

export const Modal = memo<ModalProps>(({
  visible,
  onClose,
  children,
  dismissOnBackdrop = true,
  contentStyle,
}) => (
  <RNModal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
    statusBarTranslucent
  >
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={dismissOnBackdrop ? onClose : undefined}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  </RNModal>
));

Modal.displayName = 'Modal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxlarge,
    padding: Spacing.lg,
    zIndex: Elevation.overlay,
    ...Shadows.high,
  },
});
