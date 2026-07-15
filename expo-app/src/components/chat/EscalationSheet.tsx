import React, { memo } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../app/design-system';
import type { EscalationAssessment } from '../../types/domain';
import { buttonA11y, dialogA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface EscalationSheetProps {
  assessment: EscalationAssessment | null;
  onPrimary: () => void;
  onSecondary: () => void;
  onDismiss: () => void;
}

export const EscalationSheet = memo<EscalationSheetProps>(
  ({ assessment, onPrimary, onSecondary, onDismiss }) => {
    if (!assessment || assessment.level === 'none') return null;
    const isCrisis = assessment.level === 'crisis';
    return (
      <Modal transparent animationType="fade" visible onRequestClose={onDismiss}>
        <View style={styles.backdrop}>
          <View
            style={[styles.sheet, isCrisis && styles.crisis]}
            {...dialogA11y(assessment.title)}
          >
            <Text style={styles.kicker} maxFontSizeMultiplier={1.2}>
              {assessment.level === 'therapist'
                ? 'Therapist support'
                : assessment.level === 'crisis'
                  ? 'Crisis support'
                  : 'Extra support'}
            </Text>
            <Text style={styles.title} maxFontSizeMultiplier={1.35}>
              {assessment.title}
            </Text>
            <Text style={styles.body} maxFontSizeMultiplier={1.35}>
              {assessment.body}
            </Text>
            {assessment.helplineHint ? (
              <Text style={styles.hint} maxFontSizeMultiplier={1.3}>
                {assessment.helplineHint}
              </Text>
            ) : null}
            <Pressable
              style={[styles.primary, isCrisis && styles.primaryCrisis]}
              onPress={() => {
                void hapticSelection();
                onPrimary();
              }}
              {...buttonA11y(assessment.primaryCta)}
            >
              <Text style={styles.primaryText}>{assessment.primaryCta}</Text>
            </Pressable>
            {assessment.secondaryCta ? (
              <Pressable
                style={styles.secondary}
                onPress={() => {
                  void hapticSelection();
                  onSecondary();
                }}
                {...buttonA11y(assessment.secondaryCta)}
              >
                <Text style={styles.secondaryText}>{assessment.secondaryCta}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  },
);

EscalationSheet.displayName = 'EscalationSheet';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,16,12,0.45)',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    ...Shadows.medium,
    gap: Spacing.sm,
  },
  crisis: {
    borderWidth: 2,
    borderColor: Colors.error,
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
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  hint: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  primary: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primaryCrisis: {
    backgroundColor: Colors.error,
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
