import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { EmptyState } from '../app/EmptyState';

export type PersonalizationEmptyKind =
  | 'recommendations'
  | 'goals'
  | 'habits'
  | 'insights'
  | 'journey'
  | 'continue'
  | 'reminders'
  | 'memory'
  | 'widgets';

const COPY: Record<
  PersonalizationEmptyKind,
  { title: string; message: string; icon: string }
> = {
  recommendations: {
    title: 'No recommendations yet',
    message: 'Pragya will suggest gentle next steps as you use Hey Attrangi.',
    icon: 'lightbulb-outline',
  },
  goals: {
    title: 'No daily goals',
    message: 'Goals will appear once your care plan personalizes.',
    icon: 'flag-outline',
  },
  habits: {
    title: 'No habits yet',
    message: 'Track meditation, journal, mood, sleep, and more here.',
    icon: 'checkbox-marked-circle-outline',
  },
  insights: {
    title: 'No insights yet',
    message: 'Weekly and monthly summaries unlock as you check in.',
    icon: 'chart-line',
  },
  journey: {
    title: 'Your wellness journey is empty',
    message: 'Mood, journal, therapy, and achievements will timeline here.',
    icon: 'timeline-outline',
  },
  continue: {
    title: 'Nothing to continue',
    message: 'Start a journal, chat, or breathing session to pick up later.',
    icon: 'play-circle-outline',
  },
  reminders: {
    title: 'No smart reminders',
    message: 'Mood, journal, and session nudges will show here.',
    icon: 'bell-outline',
  },
  memory: {
    title: 'No AI memory yet',
    message: 'Conversations, moods, and sessions will appear as cards.',
    icon: 'brain',
  },
  widgets: {
    title: 'No widgets enabled',
    message: 'Turn on dashboard widgets to personalize Home.',
    icon: 'view-dashboard-outline',
  },
};

export interface PersonalizationEmptyProps {
  kind: PersonalizationEmptyKind;
  compact?: boolean;
  style?: ViewStyle;
}

export const PersonalizationEmpty = memo<PersonalizationEmptyProps>(({
  kind,
  compact,
  style,
}) => {
  const c = COPY[kind];
  if (compact) {
    return (
      <View style={[styles.compact, style]} accessibilityRole="text">
        <Icon name={c.icon} size={28} color={Colors.textMuted} />
        <Text style={styles.compactTitle} maxFontSizeMultiplier={1.3}>
          {c.title}
        </Text>
        <Text style={styles.compactMsg} maxFontSizeMultiplier={1.25}>
          {c.message}
        </Text>
      </View>
    );
  }
  return (
    <View style={style}>
      <EmptyState title={c.title} message={c.message} icon={c.icon} />
    </View>
  );
});

PersonalizationEmpty.displayName = 'PersonalizationEmpty';

const styles = StyleSheet.create({
  compact: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  compactTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  compactMsg: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
});
