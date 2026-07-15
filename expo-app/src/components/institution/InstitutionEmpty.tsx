import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { EmptyState } from '../app/EmptyState';

export type InstitutionEmptyKind =
  | 'announcements'
  | 'events'
  | 'resources'
  | 'dashboard'
  | 'notifications'
  | 'programs';

const COPY: Record<
  InstitutionEmptyKind,
  { title: string; message: string; icon: string }
> = {
  announcements: {
    title: 'No announcements',
    message: 'Campus updates from your institution will appear here.',
    icon: 'bullhorn-outline',
  },
  events: {
    title: 'No events right now',
    message: 'Workshops and wellness programs will show when scheduled.',
    icon: 'calendar-star',
  },
  resources: {
    title: 'No campus resources',
    message: 'Helplines, maps, and support contacts unlock with your org.',
    icon: 'lifebuoy',
  },
  dashboard: {
    title: 'No dashboard data',
    message: 'Institution wellness overview prepares when your campus connects.',
    icon: 'view-dashboard-outline',
  },
  notifications: {
    title: 'No institution notifications',
    message: 'Announcements, events, and counselling alerts stay separate from personal inbox.',
    icon: 'bell-outline',
  },
  programs: {
    title: 'No wellness programs',
    message: 'Events, workshops, and campaigns will list here.',
    icon: 'calendar-month-outline',
  },
};

export interface InstitutionEmptyProps {
  kind: InstitutionEmptyKind;
  compact?: boolean;
  style?: ViewStyle;
}

export const InstitutionEmpty = memo<InstitutionEmptyProps>(({
  kind,
  compact,
  style,
}) => {
  const c = COPY[kind];
  if (compact) {
    return (
      <View style={[styles.compact, style]} accessibilityRole="text">
        <Icon name={c.icon} size={28} color={Colors.textMuted} />
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {c.title}
        </Text>
        <Text style={styles.msg} maxFontSizeMultiplier={1.25}>
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

InstitutionEmpty.displayName = 'InstitutionEmpty';

const styles = StyleSheet.create({
  compact: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  msg: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
});
