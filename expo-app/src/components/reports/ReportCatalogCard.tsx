import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportCatalogItem, ReportKind } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface ReportCatalogCardProps {
  item: ReportCatalogItem;
  onPress: (kind: ReportKind) => void;
}

export const ReportCatalogCard = memo<ReportCatalogCardProps>(
  ({ item, onPress }) => (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress(item.kind);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
      {...buttonA11y(item.title, {
        hint: item.description,
        disabled: false,
      })}
    >
      <AppCard style={styles.card}>
        <View style={styles.top}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {item.title}
          </Text>
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.desc} maxFontSizeMultiplier={1.3}>
          {item.description}
        </Text>
        {!item.available ? (
          <Text style={styles.soon}>Placeholder surface — backend later</Text>
        ) : null}
      </AppCard>
    </Pressable>
  ),
);

ReportCatalogCard.displayName = 'ReportCatalogCard';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 11,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  soon: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
