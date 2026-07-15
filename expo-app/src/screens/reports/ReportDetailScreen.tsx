import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, Share, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  ProgressBarChart,
  ReportActionsBar,
  ReportInsightList,
  ReportPeriodPicker,
  ReportPlaceholder,
  ReportStatGrid,
} from '../../components/reports';
import { useReportsStore } from '../../store/reportsStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { ReportExportFormat } from '../../types/domain';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ReportDetail'>;
  route: RouteProp<MainStackParamList, 'ReportDetail'>;
};

export const ReportDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { kind } = route.params;
  const activeReport = useReportsStore((s) => s.activeReport);
  const period = useReportsStore((s) => s.period);
  const reportStatus = useReportsStore((s) => s.reportStatus);
  const lastExport = useReportsStore((s) => s.lastExport);
  const exportStatus = useReportsStore((s) => s.exportStatus);
  const loadReport = useReportsStore((s) => s.loadReport);
  const setPeriod = useReportsStore((s) => s.setPeriod);
  const exportReport = useReportsStore((s) => s.exportReport);
  const prepareShare = useReportsStore((s) => s.prepareShare);
  const clearActiveReport = useReportsStore((s) => s.clearActiveReport);
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    void loadReport(kind);
    return () => clearActiveReport();
  }, [clearActiveReport, kind, loadReport]);

  const onExport = useCallback(
    async (format: ReportExportFormat) => {
      const payload = await exportReport(kind, format);
      if (!payload) {
        showToast('Could not export report', 'error');
        return;
      }
      if (payload.isPlaceholder) {
        showToast('PDF placeholder — generation comes later', 'info');
      } else {
        showToast(`Exported ${payload.filename}`, 'success');
      }
      navigation.navigate('ReportExportData', { kind, format });
    },
    [exportReport, kind, navigation, showToast],
  );

  const onShare = useCallback(async () => {
    const payload = await prepareShare(kind);
    if (!payload) {
      showToast('Could not prepare share', 'error');
      return;
    }
    try {
      await Share.share({ message: payload.message, title: payload.title });
    } catch {
      showToast('Share cancelled', 'info');
    }
  }, [kind, prepareShare, showToast]);

  const report =
    activeReport && activeReport.kind === kind ? activeReport : null;

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title={report?.title ?? 'Report'}
        subtitle={report?.subtitle ?? 'Wellness analytics'}
        onBack={() => navigation.goBack()}
      />

      <ReportPeriodPicker
        value={period}
        onChange={(p) => {
          setPeriod(p);
          void loadReport(kind, p);
        }}
      />

      {reportStatus === 'loading' && !report ? (
        <Text style={styles.loading}>Preparing report…</Text>
      ) : null}

      {report?.placeholder ? (
        <ReportPlaceholder
          title={report.title}
          message={
            report.placeholderMessage ??
            'This report will unlock when the backend is ready.'
          }
        />
      ) : null}

      {report && !report.placeholder ? (
        <>
          <AppCard style={styles.hero}>
            <Text style={styles.period}>{report.periodLabel}</Text>
            <Text style={styles.headline} maxFontSizeMultiplier={1.35}>
              {report.headline}
            </Text>
            <Text style={styles.generated} maxFontSizeMultiplier={1.2}>
              Generated {new Date(report.generatedAt).toLocaleString()}
            </Text>
            <ReportStatGrid stats={report.stats} />
          </AppCard>

          {report.charts.map((series) => (
            <AppCard key={series.id} style={styles.chartCard}>
              <ProgressBarChart series={series} />
            </AppCard>
          ))}

          <ReportInsightList insights={report.insights} />

          <ReportActionsBar
            busy={exportStatus === 'loading'}
            onExport={onExport}
            onShare={onShare}
            lastExport={lastExport?.kind === kind ? lastExport : null}
          />
        </>
      ) : null}
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
  headline: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  generated: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  chartCard: { marginBottom: Spacing.md },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
