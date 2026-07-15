import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { CampusWellnessProgram } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface ProgramCardProps {
  program: CampusWellnessProgram;
  onRegister?: (program: CampusWellnessProgram) => void;
}

const KIND_LABEL: Record<CampusWellnessProgram['kind'], string> = {
  event: 'Event',
  workshop: 'Workshop',
  campaign: 'Campaign',
  group_session: 'Group session',
  awareness: 'Awareness',
};

export const ProgramCard = memo<ProgramCardProps>(({ program, onRegister }) => (
  <View
    style={styles.card}
    accessibilityLabel={`${KIND_LABEL[program.kind]}. ${program.title}. ${program.description}`}
  >
    <Text style={styles.kind}>{KIND_LABEL[program.kind]}</Text>
    <Text style={styles.title} maxFontSizeMultiplier={1.3}>
      {program.title}
    </Text>
    <Text style={styles.body} maxFontSizeMultiplier={1.25}>
      {program.description}
    </Text>
    <View style={styles.meta}>
      <Icon name="clock-outline" size={14} color={Colors.textMuted} />
      <Text style={styles.metaText}>{program.whenLabel}</Text>
      <Icon name="map-marker-outline" size={14} color={Colors.textMuted} />
      <Text style={styles.metaText}>{program.whereLabel}</Text>
    </View>
    <Pressable
      style={[styles.cta, program.registered && styles.ctaDone]}
      onPress={() => onRegister?.(program)}
      disabled={program.registered}
      android_ripple={
        Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
      }
      {...buttonA11y(program.ctaLabel)}
    >
      <Text style={[styles.ctaText, program.registered && styles.ctaTextDone]}>
        {program.ctaLabel}
      </Text>
    </Pressable>
  </View>
));

ProgramCard.displayName = 'ProgramCard';

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.md,
    ...Shadows.low,
  },
  kind: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  cta: {
    marginTop: Spacing.md,
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  ctaDone: {
    backgroundColor: Colors.badgeGreen,
  },
  ctaText: {
    ...Typography.label,
    color: Colors.white,
    fontWeight: '700',
  },
  ctaTextDone: {
    color: Colors.textPrimary,
  },
});
