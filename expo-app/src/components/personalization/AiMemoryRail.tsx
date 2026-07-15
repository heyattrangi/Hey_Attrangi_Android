import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView } from 'react-native';
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
import { AiMemoryCard as AiMemoryCardModel } from '../../types/domain';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface AiMemoryRailProps {
  items: AiMemoryCardModel[];
  onPressItem?: (item: AiMemoryCardModel) => void;
}

export const AiMemoryRail = memo<AiMemoryRailProps>(({ items, onPressItem }) => {
  if (items.length === 0) {
    return (
      <View>
        <SectionHeader title="AI memory" />
        <PersonalizationEmpty kind="memory" compact />
      </View>
    );
  }

  return (
    <View>
      <SectionHeader
        title="AI memory"
        subtitle="What Attrangi remembers for you"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => onPressItem?.(item)}
            android_ripple={
              Platform.OS === 'android'
                ? { color: Colors.primaryLight }
                : undefined
            }
            {...buttonA11y(`${item.title}. ${item.snippet}. ${item.whenLabel}`)}
          >
            <View style={styles.icon}>
              <Icon name={item.icon} size={18} color={Colors.accentPurple} />
            </View>
            <Text style={styles.title} numberOfLines={1} maxFontSizeMultiplier={1.25}>
              {item.title}
            </Text>
            <Text style={styles.snippet} numberOfLines={3} maxFontSizeMultiplier={1.25}>
              {item.snippet}
            </Text>
            <Text style={styles.when}>{item.whenLabel}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

AiMemoryRail.displayName = 'AiMemoryRail';

const styles = StyleSheet.create({
  row: { gap: Spacing.sm, paddingRight: Spacing.md },
  card: {
    width: 180,
    minHeight: 140,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Shadows.low,
  },
  icon: {
    width: MIN_TOUCH_TARGET - 12,
    height: MIN_TOUCH_TARGET - 12,
    borderRadius: Radius.large,
    backgroundColor: 'rgba(124, 92, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  snippet: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginTop: 4,
    lineHeight: 17,
  },
  when: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: Spacing.sm,
  },
});
