import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  ReportCatalogCard,
  ReportPeriodPicker,
  ReportStatGrid,
  ProgressBarChart,
} from '../../components/reports';
import { useReportsStore } from '../../store/reportsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportKind } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WellnessReportsHub'>;
};

export const WellnessReportsHubScreen: React.FC<Props> = ({ navigation }) => {
  const catalog = useReportsStore((s) => s.catalog);
  const dashboard = useReportsStore((s) => s.dashboard);
  const period = useReportsStore((s) => s.period);
  const status = useReportsStore((s) => s.status);
  const loadCatalog = useReportsStore((s) => s.loadCatalog);
  const loadDashboard = useReportsStore((s) => s.loadDashboard);
  const setPeriod = useReportsStore((s) => s.setPeriod);

  useEffect(() => {
    void loadCatalog();
    void loadDashboard();
  }, [loadCatalog, loadDashboard]);

  const openKind = useCallback(
    (kind: ReportKind) => {
      if (kind === 'wellness') {
        navigation.navigate('WellnessReportsDashboard');
        return;
      }
      if (kind === 'institution') {
        navigation.navigate('InstitutionReports');
        return;
      }
      if (kind === 'parent') {
        navigation.navigate('ParentReports');
        return;
      }
      navigation.navigate('ReportDetail', { kind });
    },
    [navigation],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Wellness Reports"
        subtitle="Analytics & exports"
        onBack={() => navigation.goBack()}
      />

      <ReportPeriodPicker
        value={period}
        onChange={(p) => {
          setPeriod(p);
          void loadDashboard(p);
        }}
      />

      {dashboard ? (
        <Pressable
          onPress={() => {
            void hapticSelection();
            navigation.navigate('WellnessReportsDashboard');
          }}
          {...buttonA11y('Open wellness dashboard')}
        >
          <AppCard style={styles.hero}>
            <Text style={styles.kicker}>{dashboard.periodLabel}</Text>
            <Text style={styles.score}>{dashboard.overallScore}</Text>
            <Text style={styles.label}>{dashboard.overallLabel}</Text>
            <ReportStatGrid stats={dashboard.stats.slice(0, 4)} />
            {dashboard.charts[0] ? (
              <View style={styles.chartPad}>
                <ProgressBarChart series={dashboard.charts[0]} />
              </View>
            ) : null}
            <Text style={styles.cta}>View full dashboard →</Text>
          </AppCard>
        </Pressable>
      ) : status === 'loading' ? (
        <Text style={styles.loading}>Loading reports…</Text>
      ) : null}

      <Text style={styles.section}>All reports</Text>
      {catalog.map((item) => (
        <ReportCatalogCard key={item.kind} item={item} onPress={openKind} />
      ))}

      <Pressable
        style={styles.exportLink}
        onPress={() => navigation.navigate('ReportExportData')}
        {...buttonA11y('Export data')}
      >
        <Text style={styles.exportText}>Export my wellness data →</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  kicker: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  score: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  label: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  chartPad: {
    marginTop: Spacing.sm,
  },
  cta: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: Spacing.sm,
  },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  exportLink: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  exportText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
