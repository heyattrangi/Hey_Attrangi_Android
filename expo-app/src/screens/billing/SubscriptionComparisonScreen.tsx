import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { SkeletonPlans } from '../../components/billing';
import { AsyncStateRenderer } from '../../components/async';
import { useBillingStore } from '../../store/billingStore';
import { ComparisonFeatureGroup } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'SubscriptionComparison'
  >;
};

const GROUP_LABEL: Record<ComparisonFeatureGroup, string> = {
  ai: 'AI Features',
  therapy: 'Therapy Benefits',
  mood: 'Mood Analytics',
  reports: 'Reports',
  voice: 'Voice Features',
  journal: 'Journal',
  future: 'Future Features',
};

const cell = (value: boolean | string) => {
  if (typeof value === 'string') return value;
  return value ? '✓' : '—';
};

export const SubscriptionComparisonScreen: React.FC<Props> = ({
  navigation,
}) => {
  const comparison = useBillingStore((s) => s.comparison);
  const status = useBillingStore((s) => s.status);
  const error = useBillingStore((s) => s.error);
  const fetchBillingHome = useBillingStore((s) => s.fetchBillingHome);

  useEffect(() => {
    if (!comparison.length) fetchBillingHome();
  }, [comparison.length, fetchBillingHome]);

  const groups = useMemo(() => {
    const order: ComparisonFeatureGroup[] = [
      'ai',
      'therapy',
      'mood',
      'reports',
      'voice',
      'journal',
      'future',
    ];
    return order
      .map((g) => ({
        id: g,
        title: GROUP_LABEL[g],
        rows: comparison.filter((r) => r.group === g),
      }))
      .filter((g) => g.rows.length > 0);
  }, [comparison]);

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader
        title="Compare plans"
        subtitle="Essential vs Premium — feature by feature"
        onBack={() => navigation.goBack()}
      />

      <AsyncStateRenderer
        screenId="subscriptionComparison"
        status={status === 'idle' || status === 'loading' ? status : 'success'}
        error={error}
        onRetry={fetchBillingHome}
        hasCachedData={comparison.length > 0}
        loading={<SkeletonPlans />}
        preferSkeleton
      >
        <View style={styles.headerRow}>
          <Text style={[styles.colFeature, styles.headerText]}>Feature</Text>
          <Text style={[styles.colPlan, styles.headerText]}>Essential</Text>
          <Text style={[styles.colPlan, styles.headerText, styles.premiumCol]}>
            Premium
          </Text>
        </View>

        {groups.map((group) => (
          <View key={group.id} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <AppCard style={styles.tableCard}>
              {group.rows.map((row) => (
                <View key={row.id} style={styles.row}>
                  <Text style={styles.colFeature}>{row.label}</Text>
                  <Text style={styles.colPlan}>{cell(row.essential)}</Text>
                  <Text style={[styles.colPlan, styles.premiumCell]}>
                    {cell(row.premium)}
                  </Text>
                </View>
              ))}
            </AppCard>
          </View>
        ))}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  headerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  colFeature: {
    flex: 1.4,
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  colPlan: {
    flex: 1,
    textAlign: 'center',
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  premiumCol: { color: Colors.primaryDark },
  premiumCell: { color: Colors.primaryDark, fontWeight: '700' },
  group: { marginBottom: Spacing.md },
  groupTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  tableCard: {
    borderRadius: Radius.large,
    paddingVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
});
