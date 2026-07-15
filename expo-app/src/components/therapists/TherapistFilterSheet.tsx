import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { BottomSheet } from '../ui/BottomSheet';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { TherapistFilters } from '../../services/therapists/ITherapistService';
import {
  SessionModality,
  TherapistGender,
} from '../../types/domain';
import { Colors, Typography, Radius, Spacing, Motion } from '../../app/design-system';
import { hapticSelection } from '../../utils/haptics';

export interface TherapistFilterSheetProps {
  visible: boolean;
  value: TherapistFilters;
  onClose: () => void;
  onApply: (filters: TherapistFilters) => void;
  onReset: () => void;
}

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Punjabi', 'Marathi'];
const GENDERS: Array<TherapistGender | 'Any'> = ['Any', 'Female', 'Male', 'Non-binary'];
const EXPERIENCE = [
  { label: 'Any', years: undefined },
  { label: '3+ years', years: 3 },
  { label: '5+ years', years: 5 },
  { label: '8+ years', years: 8 },
];
const FEES = [
  { label: 'Any', max: undefined },
  { label: 'Under ₹1,000', max: 1000 },
  { label: 'Under ₹1,200', max: 1200 },
  { label: 'Under ₹1,500', max: 1500 },
];
const AVAILABILITY: Array<{ label: string; value: TherapistFilters['availability'] }> = [
  { label: 'Any', value: 'any' },
  { label: 'Available today', value: 'today' },
  { label: 'This week', value: 'this_week' },
];
const SESSION_TYPES: Array<SessionModality | 'Any'> = ['Any', 'Chat', 'Audio', 'Video'];
const SPECIALIZATIONS = [
  'Any',
  'Anxiety',
  'Depression',
  'Burnout',
  'Relationships',
  'Trauma',
  'Sleep issues',
];
const RATINGS = [
  { label: 'Any', min: undefined },
  { label: '4.5+', min: 4.5 },
  { label: '4.8+', min: 4.8 },
];

const Chip = memo<{
  label: string;
  selected: boolean;
  onPress: () => void;
}>(({ label, selected, onPress }) => (
  <Pressable
    onPress={() => {
      void hapticSelection();
      onPress();
    }}
    style={[styles.chip, selected && styles.chipSelected]}
    android_ripple={Platform.OS === 'android' ? { color: 'transparent' } : undefined}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </Pressable>
));
Chip.displayName = 'FilterChip';

const Section = memo<{ title: string; children: React.ReactNode }>(({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.chipRow}>{children}</View>
  </View>
));
Section.displayName = 'FilterSection';

export const TherapistFilterSheet = memo<TherapistFilterSheetProps>(({
  visible,
  value,
  onClose,
  onApply,
  onReset,
}) => {
  const [draft, setDraft] = useState<TherapistFilters>(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const set = <K extends keyof TherapistFilters>(key: K, v: TherapistFilters[K]) => {
    setDraft((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filters">
      <Section title="Language">
        {LANGUAGES.map((lang) => (
          <Chip
            key={lang}
            label={lang}
            selected={draft.language === lang}
            onPress={() => set('language', draft.language === lang ? undefined : lang)}
          />
        ))}
      </Section>

      <Section title="Gender">
        {GENDERS.map((g) => (
          <Chip
            key={g}
            label={g}
            selected={(draft.gender ?? 'Any') === g}
            onPress={() => set('gender', g === 'Any' ? undefined : g)}
          />
        ))}
      </Section>

      <Section title="Experience">
        {EXPERIENCE.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            selected={draft.experienceMinYears === item.years}
            onPress={() => set('experienceMinYears', item.years)}
          />
        ))}
      </Section>

      <Section title="Consultation Fee">
        {FEES.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            selected={draft.feeMax === item.max}
            onPress={() => set('feeMax', item.max)}
          />
        ))}
      </Section>

      <Section title="Availability">
        {AVAILABILITY.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            selected={(draft.availability ?? 'any') === item.value}
            onPress={() => set('availability', item.value === 'any' ? undefined : item.value)}
          />
        ))}
      </Section>

      <Section title="Session Type">
        {SESSION_TYPES.map((type) => (
          <Chip
            key={type}
            label={type}
            selected={
              type === 'Any'
                ? !draft.sessionType
                : draft.sessionType === type
            }
            onPress={() =>
              set('sessionType', type === 'Any' ? undefined : (type as SessionModality))
            }
          />
        ))}
      </Section>

      <Section title="Specialization">
        {SPECIALIZATIONS.map((spec) => (
          <Chip
            key={spec}
            label={spec}
            selected={
              spec === 'Any' ? !draft.specialty : draft.specialty === spec
            }
            onPress={() => set('specialty', spec === 'Any' ? undefined : spec)}
          />
        ))}
      </Section>

      <Section title="Rating">
        {RATINGS.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            selected={draft.minRating === item.min}
            onPress={() => set('minRating', item.min)}
          />
        ))}
      </Section>

      <View style={styles.actions}>
        <SecondaryButton
          label="Reset"
          onPress={() => {
            setDraft({});
            onReset();
          }}
          size="full"
        />
        <PrimaryButton
          label="Clear All"
          variant="outline"
          onPress={() => setDraft({})}
        />
        <PrimaryButton
          label="Apply Filters"
          onPress={() => {
            onApply(draft);
            onClose();
          }}
          showArrow
        />
      </View>
    </BottomSheet>
  );
});

TherapistFilterSheet.displayName = 'TherapistFilterSheet';

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  chipRow: {
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
    backgroundColor: Colors.surface,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
});
