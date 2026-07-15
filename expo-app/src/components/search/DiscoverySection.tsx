import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SearchDiscoveryBlock, SearchResultItem } from '../../search/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

export interface DiscoverySectionProps {
  block: SearchDiscoveryBlock;
  onPressItem: (item: SearchResultItem) => void;
}

export const DiscoverySection = memo<DiscoverySectionProps>(({
  block,
  onPressItem,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>{block.title}</Text>
    {block.subtitle ? (
      <Text style={styles.subtitle}>{block.subtitle}</Text>
    ) : null}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {block.items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => onPressItem(item)}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y(item.title)}
        >
          <Icon
            name={item.icon ?? 'magnify'}
            size={22}
            color={Colors.primary}
          />
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.subtitle ? (
            <Text style={styles.cardSub} numberOfLines={1}>
              {item.subtitle}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
));

DiscoverySection.displayName = 'DiscoverySection';

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.lg },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  row: { gap: Spacing.sm, paddingTop: Spacing.sm },
  card: {
    width: 148,
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.md,
    minHeight: 110,
  },
  cardTitle: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  cardSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },
});
