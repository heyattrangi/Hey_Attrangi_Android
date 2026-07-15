import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useFamilyStore } from '../../store/familyStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CaregiverDashboard'>;
};

/** Caregiver toolkit — placeholder until caregiver role backend */
export const CaregiverDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const caregiverDashboard = useFamilyStore((s) => s.caregiverDashboard);
  const loadSnapshot = useFamilyStore((s) => s.loadSnapshot);
  const enabled = useFeatureFlag('enableCaregiverDashboard');

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Caregiver Dashboard"
        subtitle="Placeholder"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {enabled ? 'UI ready · backend later' : 'Feature flagged off'}
        </Text>
      </View>
      <AppCard style={styles.card}>
        <Text style={styles.title} maxFontSizeMultiplier={1.35}>
          {caregiverDashboard?.title ?? 'Caregiver Dashboard'}
        </Text>
        <Text style={styles.sub}>{caregiverDashboard?.subtitle}</Text>
        <Text style={styles.body} maxFontSizeMultiplier={1.35}>
          {caregiverDashboard?.message}
        </Text>
      </AppCard>
      <Text style={styles.section}>Planned modules</Text>
      {(caregiverDashboard?.modules ?? []).map((mod) => (
        <AppCard key={mod.id} style={styles.mod}>
          <Text style={styles.modTitle}>{mod.title}</Text>
          <Text style={styles.modBody}>{mod.description}</Text>
        </AppCard>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  card: { gap: Spacing.sm, marginBottom: Spacing.lg },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  mod: { marginBottom: Spacing.sm, gap: 4 },
  modTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
