import React, { memo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { BottomSheet } from '../ui/BottomSheet';
import {
  SearchDomain,
  SearchFilters,
  SearchSortBy,
  PRIMARY_SEARCH_CHIPS,
  SEARCH_DOMAIN_META,
} from '../../search/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, toggleA11y } from '../../utils/accessibility';

export interface SearchFilterSheetProps {
  visible: boolean;
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onReset: () => void;
  onClose: () => void;
}

const SORTS: Array<{ id: SearchSortBy; label: string }> = [
  { id: 'relevant', label: 'Most Relevant' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'alphabetical', label: 'Alphabetical' },
];

export const SearchFilterSheet = memo<SearchFilterSheetProps>(({
  visible,
  filters,
  onChange,
  onReset,
  onClose,
}) => {
  const [therapistDraft, setTherapistDraft] = useState(filters.therapist ?? '');

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Search filters">
      <Text style={styles.label}>Category</Text>
      <View style={styles.wrap}>
        <Chip
          label="All"
          selected={filters.category === 'all'}
          onPress={() => onChange({ category: 'all' })}
        />
        {PRIMARY_SEARCH_CHIPS.map((d: SearchDomain) => (
          <Chip
            key={d}
            label={SEARCH_DOMAIN_META[d].chip}
            selected={filters.category === d}
            onPress={() => onChange({ category: d })}
          />
        ))}
      </View>

      <Text style={styles.label}>Sort by</Text>
      <View style={styles.wrap}>
        {SORTS.map((s) => (
          <Chip
            key={s.id}
            label={s.label}
            selected={filters.sortBy === s.id}
            onPress={() => onChange({ sortBy: s.id })}
          />
        ))}
      </View>

      <Text style={styles.label}>Therapist</Text>
      <TextInput
        style={styles.input}
        value={therapistDraft}
        onChangeText={setTherapistDraft}
        onEndEditing={() => onChange({ therapist: therapistDraft.trim() || undefined })}
        placeholder="Filter by therapist name"
        placeholderTextColor={Colors.textMuted}
        accessibilityLabel="Therapist filter"
      />

      <Text style={styles.label}>Date range</Text>
      <View style={styles.wrap}>
        <Chip
          label="Any time"
          selected={!filters.dateFrom && !filters.dateTo}
          onPress={() => onChange({ dateFrom: undefined, dateTo: undefined })}
        />
        <Chip
          label="Last 7 days"
          selected={Boolean(filters.dateFrom)}
          onPress={() => {
            const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            onChange({ dateFrom: from, dateTo: new Date().toISOString() });
          }}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            setTherapistDraft('');
            onReset();
          }}
          {...buttonA11y('Reset filters')}
        >
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.apply}
          onPress={() => {
            onChange({ therapist: therapistDraft.trim() || undefined });
            onClose();
          }}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y('Apply filters')}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

SearchFilterSheet.displayName = 'SearchFilterSheet';

const Chip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipOn]}
    onPress={onPress}
    activeOpacity={Motion.opacity.pressed}
    {...toggleA11y(label, selected)}
  >
    <Text style={[styles.chipText, selected && styles.chipTextOn]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  chipOn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chipTextOn: { color: Colors.primaryDark, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    color: Colors.textPrimary,
    minHeight: 44,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  reset: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
  apply: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.medium,
    minHeight: 44,
    justifyContent: 'center',
  },
  applyText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
