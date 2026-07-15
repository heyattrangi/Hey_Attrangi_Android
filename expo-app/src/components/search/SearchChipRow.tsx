import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SearchDomain, PRIMARY_SEARCH_CHIPS, SEARCH_DOMAIN_META } from '../../search/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { toggleA11y } from '../../utils/accessibility';

export interface SearchChipRowProps {
  selected?: SearchDomain | 'all';
  onSelect: (domain: SearchDomain | 'all') => void;
  domains?: SearchDomain[];
  showAll?: boolean;
}

export const SearchChipRow = memo<SearchChipRowProps>(({
  selected = 'all',
  onSelect,
  domains = PRIMARY_SEARCH_CHIPS,
  showAll = true,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.row}
    accessibilityRole="tablist"
  >
    {showAll ? (
      <TouchableOpacity
        style={[styles.chip, selected === 'all' && styles.chipOn]}
        onPress={() => onSelect('all')}
        activeOpacity={Motion.opacity.pressed}
        {...toggleA11y('All', selected === 'all')}
      >
        <Text style={[styles.text, selected === 'all' && styles.textOn]}>All</Text>
      </TouchableOpacity>
    ) : null}
    {domains.map((d) => {
      const meta = SEARCH_DOMAIN_META[d];
      const on = selected === d;
      return (
        <TouchableOpacity
          key={d}
          style={[styles.chip, on && styles.chipOn]}
          onPress={() => onSelect(d)}
          activeOpacity={Motion.opacity.pressed}
          {...toggleA11y(meta.chip, on)}
        >
          <Text style={[styles.text, on && styles.textOn]}>{meta.chip}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
));

SearchChipRow.displayName = 'SearchChipRow';

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipOn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  text: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  textOn: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
