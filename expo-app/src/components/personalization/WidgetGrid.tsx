import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../app/design-system';
import { SectionHeader } from '../ui/SectionHeader';
import { PersonalizedWidget } from './PersonalizedWidget';
import { PersonalizationEmpty } from './PersonalizationEmpty';
import {
  DailyGoal,
  DashboardWidgetConfig,
  DashboardWidgetId,
} from '../../types/domain';

export interface WidgetGridProps {
  widgets: DashboardWidgetConfig[];
  goals: DailyGoal[];
  moodLabel?: string | null;
  sessionLabel?: string | null;
  onPressWidget: (id: DashboardWidgetId) => void;
  onCustomize?: () => void;
}

const ICON: Record<DashboardWidgetId, string> = {
  mood: 'emoticon-outline',
  journal: 'notebook-outline',
  session: 'calendar-clock',
  ai_reflection: 'robot-outline',
  sleep: 'sleep',
  water: 'water-outline',
  meditation: 'meditation',
  goals: 'flag-outline',
};

export const WidgetGrid = memo<WidgetGridProps>(({
  widgets,
  goals,
  moodLabel,
  sessionLabel,
  onPressWidget,
  onCustomize,
}) => {
  const enabled = useMemo(
    () =>
      [...widgets]
        .filter((w) => w.enabled)
        .sort((a, b) => a.order - b.order),
    [widgets],
  );

  const goalsDone = goals.filter((g) => g.completed).length;
  const hydration = goals.find((g) => g.kind === 'hydration');

  if (enabled.length === 0) {
    return (
      <View>
        <SectionHeader title="Your widgets" onAction={onCustomize} actionLabel="Customize" />
        <PersonalizationEmpty kind="widgets" compact />
      </View>
    );
  }

  const contentFor = (id: DashboardWidgetId) => {
    switch (id) {
      case 'mood':
        return {
          value: moodLabel || 'Check in',
          subtitle: moodLabel ? 'Today' : 'Tap to log',
        };
      case 'journal':
        return { value: 'Write', subtitle: 'Continue entry' };
      case 'session':
        return {
          value: sessionLabel || 'None soon',
          subtitle: sessionLabel ? 'Upcoming' : 'Book care',
        };
      case 'ai_reflection':
        return { value: 'Reflect', subtitle: 'With Pragya' };
      case 'sleep':
        return { value: '—', subtitle: 'Log soon' };
      case 'water':
        return {
          value: hydration
            ? `${hydration.progress}/${hydration.target}`
            : '0/8',
          subtitle: 'Glasses',
          progress: hydration
            ? hydration.progress / hydration.target
            : 0,
        };
      case 'meditation':
        return { value: '5 min', subtitle: 'Suggested' };
      case 'goals':
        return {
          value: `${goalsDone}/${goals.length || 0}`,
          subtitle: 'Complete',
          progress: goals.length ? goalsDone / goals.length : 0,
        };
      default:
        return { value: '—' };
    }
  };

  return (
    <View>
      <SectionHeader
        title="Your widgets"
        subtitle="Backend-configurable dashboard"
        actionLabel={onCustomize ? 'Edit' : undefined}
        onAction={onCustomize}
      />
      <View style={styles.grid}>
        {enabled.map((w) => {
          const c = contentFor(w.id);
          return (
            <PersonalizedWidget
              key={w.id}
              id={w.id}
              title={w.title}
              value={c.value}
              subtitle={c.subtitle}
              icon={ICON[w.id]}
              progress={c.progress}
              onPress={() => onPressWidget(w.id)}
            />
          );
        })}
      </View>
    </View>
  );
});

WidgetGrid.displayName = 'WidgetGrid';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
});
