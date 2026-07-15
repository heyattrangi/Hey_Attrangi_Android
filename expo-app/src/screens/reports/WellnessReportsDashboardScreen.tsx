import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Share } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  ProgressBarChart,
  ReportActionsBar,
  ReportInsightList,
  ReportPeriodPicker,
  ReportStatGrid,
} from '../../components/reports';
import { useReportsStore } from '../../store/reportsStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { ReportExportFormat, ReportKind } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'WellnessReportsDashboard'
  >;
};

export const WellnessReportsDashboardScreen: React.FC<Props> = ({
  navigation,
}) => {
  const dashboard = useReportsStore((s) => s.dashboard);
  const period = useReportsStore((s) => s.period);
  const lastExport = useReportsStore((s) => s.lastExport);
  const exportStatus = useReportsStore((s) => s.exportStatus);
  const loadDashboard = useReportsStore((s) => s.loadDashboard);
  const setPeriod = useReportsStore((s) => s.setPeriod);
  const exportReport = useReportsStore((s) => s.exportReport);
  const prepareShare = useReportsStore((s) => s.prepareShare);
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const onExport = useCallback(
    async (format: ReportExportFormat) => {
      const payload = await exportReport('wellness', format);
      if (!payload) {
        showToast('Could not export report', 'error');
        return;
      }
      if (payload.isPlaceholder) {
        showToast('PDF placeholder ready — generation comes later', 'info');
      } else {
        showToast(`Exported ${payload.filename}`, 'success');
      }
      navigation.navigate('ReportExportData', {
        kind: 'wellness',
        format,
      });
    },
    [exportReport, navigation, showToast],
  );

  const onShare = useCallback(async () => {
    const payload = await prepareShare('wellness');
    if (!payload) {
      showToast('Could not prepare share', 'error');
      return;
    }
    try {
      await Share.share({ message: payload.message, title: payload.title });
    } catch {
      showToast('Share cancelled', 'info');
    }
  }, [prepareShare, showToast]);

  const openReport = useCallback(
    (kind: ReportKind) => {
      void hapticSelection();
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
        title="Wellness Dashboard"
        subtitle="Progress charts & highlights"
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
        <>
          <AppCard style={styles.hero}>
            <Text style={styles.period}>{dashboard.periodLabel}</Text>
            <Text style={styles.score}>{dashboard.overallScore}</Text>
            <Text style={styles.label}>{dashboard.overallLabel}</Text>
            <ReportStatGrid stats={dashboard.stats} />
          </AppCard>

          <Text style={styles.section}>Progress charts</Text>
          {dashboard.charts.map((series) => (
            <AppCard key={series.id} style={styles.chartCard}>
              <ProgressBarChart series={series} />
            </AppCard>
          ))}

          <ReportInsightList
            insights={dashboard.highlights}
            title="Highlights"
          />

          <Text style={[styles.section, styles.spaced]}>Recent reports</Text>
          {dashboard.recentReports.map((item) => (
            <Pressable
              key={item.kind}
              onPress={() => openReport(item.kind)}
              style={styles.recent}
              {...buttonA11y(item.title)}
            >
              <View>
                <Text style={styles.recentTitle}>{item.title}</Text>
                <Text style={styles.recentSub}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>→</Text>
            </Pressable>
          ))}

          <ReportActionsBar
            busy={exportStatus === 'loading'}
            onExport={onExport}
            onShare={onShare}
            lastExport={lastExport?.kind === 'wellness' ? lastExport : null}
          />
        </>
      ) : (
        <Text style={styles.loading}>Loading dashboard…</Text>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero: { gap: Spacing.sm, marginBottom: Spacing.lg },
  period: {
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
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  chartCard: { marginBottom: Spacing.md },
  recent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
    minHeight: 56,
  },
  recentTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recentSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chevron: {
    ...Typography.body,
    color: Colors.primaryDark,
  },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
