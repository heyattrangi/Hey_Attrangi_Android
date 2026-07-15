import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchResultItem, SEARCH_DOMAIN_META } from '../../search/types';
import { Colors, Motion, Radius, Shadows, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

export interface SearchResultCardProps {
  item: SearchResultItem;
  onPress: () => void;
}

export const SearchResultCard = memo<SearchResultCardProps>(({ item, onPress }) => {
  const meta = SEARCH_DOMAIN_META[item.domain] ?? SEARCH_DOMAIN_META.settings;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={Motion.opacity.pressed}
      {...buttonA11y(item.title, { hint: item.subtitle ?? meta.label })}
    >
      <View style={[styles.iconWrap, domainTint(item.domain)]}>
        <Icon name={item.icon ?? meta.icon} size={22} color={Colors.primaryDark} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.domain}>{meta.label}</Text>
        <Text style={styles.title} numberOfLines={1} maxFontSizeMultiplier={1.35}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={styles.sub} numberOfLines={2} maxFontSizeMultiplier={1.4}>
            {item.subtitle}
          </Text>
        ) : null}
        {item.meta ? <Text style={styles.meta}>{item.meta}</Text> : null}
      </View>
      <Icon name="chevron-right" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
});

SearchResultCard.displayName = 'SearchResultCard';

const domainTint = (domain: string) => {
  switch (domain) {
    case 'therapists':
      return { backgroundColor: Colors.peachMuted };
    case 'ai':
    case 'aiHistory':
      return { backgroundColor: 'rgba(124, 92, 191, 0.12)' };
    case 'mood':
      return { backgroundColor: Colors.primaryLight };
    case 'journal':
      return { backgroundColor: 'rgba(43, 108, 176, 0.12)' };
    case 'sessions':
      return { backgroundColor: Colors.peachMuted };
    case 'wellness':
      return { backgroundColor: 'rgba(56, 161, 105, 0.12)' };
    default:
      return { backgroundColor: Colors.calendarInactive };
  }
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadows.low,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  domain: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  title: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: 2,
  },
});
