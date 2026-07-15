import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { PersonalizationEmpty } from './PersonalizationEmpty';
import { DashboardWidgetConfig } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

/**
 * Drag-and-drop placeholder — reorder via up/down until gesture DnD ships.
 * Backend will persist order via IPersonalizationService.reorderWidgets.
 */
export interface DashboardReorderListProps {
  widgets: DashboardWidgetConfig[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onToggle?: (id: string) => void;
}

export const DashboardReorderList = memo<DashboardReorderListProps>(({
  widgets,
  onMoveUp,
  onMoveDown,
  onToggle,
}) => {
  const sorted = [...widgets].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return <PersonalizationEmpty kind="widgets" />;
  }

  return (
    <View>
      <SectionHeader
        title="Dashboard layout"
        subtitle="Reorder sections — drag-and-drop coming soon"
      />
      {sorted.map((w, index) => (
        <View key={w.id} style={[styles.row, !w.enabled && styles.disabled]}>
          <Pressable
            style={styles.handle}
            {...buttonA11y(`Reorder handle for ${w.title}`)}
            accessibilityHint="Drag and drop placeholder"
          >
            <Icon name="drag-horizontal-variant" size={22} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.copy}>
            <Text style={styles.title} maxFontSizeMultiplier={1.3}>
              {w.title}
            </Text>
            <Text style={styles.sub}>
              {w.enabled ? 'Visible on Home' : 'Hidden'} · order {index + 1}
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              style={styles.btn}
              onPress={() => onMoveUp(w.id)}
              disabled={index === 0}
              {...buttonA11y(`Move ${w.title} up`)}
            >
              <Icon
                name="chevron-up"
                size={20}
                color={index === 0 ? Colors.textMuted : Colors.textPrimary}
              />
            </Pressable>
            <Pressable
              style={styles.btn}
              onPress={() => onMoveDown(w.id)}
              disabled={index === sorted.length - 1}
              {...buttonA11y(`Move ${w.title} down`)}
            >
              <Icon
                name="chevron-down"
                size={20}
                color={
                  index === sorted.length - 1
                    ? Colors.textMuted
                    : Colors.textPrimary
                }
              />
            </Pressable>
            {onToggle ? (
              <Pressable
                style={styles.btn}
                onPress={() => onToggle(w.id)}
                {...buttonA11y(
                  w.enabled ? `Hide ${w.title}` : `Show ${w.title}`,
                )}
              >
                <Icon
                  name={w.enabled ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={Colors.primary}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
});

DashboardReorderList.displayName = 'DashboardReorderList';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    ...Shadows.low,
    minHeight: MIN_TOUCH_TARGET + 8,
  },
  disabled: { opacity: 0.55 },
  handle: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: MIN_TOUCH_TARGET - 4,
    height: MIN_TOUCH_TARGET - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
