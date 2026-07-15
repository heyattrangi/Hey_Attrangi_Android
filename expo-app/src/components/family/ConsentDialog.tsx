import React, { memo } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../app/design-system';
import type { ConsentDialogContent } from '../../types/domain';
import { buttonA11y, dialogA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface ConsentDialogProps {
  visible: boolean;
  content: ConsentDialogContent | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Consent for invites, emergency / wellness sharing, revoke */
export const ConsentDialog = memo<ConsentDialogProps>(
  ({ visible, content, onConfirm, onCancel }) => {
    if (!content) return null;
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.backdrop}>
          <View style={styles.card} {...dialogA11y(content.title)}>
            <Text style={styles.kicker}>Consent</Text>
            <Text style={styles.title} maxFontSizeMultiplier={1.35}>
              {content.title}
            </Text>
            <Text style={styles.body} maxFontSizeMultiplier={1.35}>
              {content.body}
            </Text>
            {content.scopesPreview?.length ? (
              <View style={styles.scopes}>
                {content.scopesPreview.map((scope) => (
                  <Text key={scope} style={styles.scope}>
                    · {scope}
                  </Text>
                ))}
              </View>
            ) : null}
            <Pressable
              style={styles.primary}
              onPress={() => {
                void hapticSelection();
                onConfirm();
              }}
              {...buttonA11y(content.primaryLabel)}
            >
              <Text style={styles.primaryText}>{content.primaryLabel}</Text>
            </Pressable>
            <Pressable
              style={styles.secondary}
              onPress={() => {
                void hapticSelection();
                onCancel();
              }}
              {...buttonA11y(content.secondaryLabel)}
            >
              <Text style={styles.secondaryText}>{content.secondaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  },
);

ConsentDialog.displayName = 'ConsentDialog';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,16,12,0.45)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  kicker: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  scopes: { marginTop: Spacing.xs, gap: 2 },
  scope: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  primary: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '700',
  },
  secondary: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
