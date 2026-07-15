import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Share } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useReportsStore } from '../../store/reportsStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { ReportExportFormat, ReportKind } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ReportExportData'>;
  route: RouteProp<MainStackParamList, 'ReportExportData'>;
};

const KINDS: ReportKind[] = [
  'wellness',
  'mood',
  'weekly',
  'monthly',
  'therapy',
  'journal',
  'habit',
  'sleep',
  'stress',
];

const FORMATS: ReportExportFormat[] = ['pdf', 'csv', 'json'];

export const ReportExportDataScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const initialKind = route.params?.kind ?? 'wellness';
  const initialFormat = route.params?.format ?? 'json';
  const [kind, setKind] = useState<ReportKind>(initialKind);
  const [format, setFormat] = useState<ReportExportFormat>(initialFormat);
  const exportReport = useReportsStore((s) => s.exportReport);
  const prepareShare = useReportsStore((s) => s.prepareShare);
  const lastExport = useReportsStore((s) => s.lastExport);
  const exportStatus = useReportsStore((s) => s.exportStatus);
  const period = useReportsStore((s) => s.period);
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    void exportReport(kind, format, period);
  }, [exportReport, format, kind, period]);

  const runExport = useCallback(
    async (nextFormat: ReportExportFormat) => {
      void hapticSelection();
      setFormat(nextFormat);
      const payload = await exportReport(kind, nextFormat, period);
      if (!payload) {
        showToast('Export failed', 'error');
        return;
      }
      if (payload.isPlaceholder) {
        showToast('PDF placeholder prepared', 'info');
      } else {
        showToast(`Ready: ${payload.filename}`, 'success');
      }
    },
    [exportReport, kind, period, showToast],
  );

  const onShare = useCallback(async () => {
    const payload = await prepareShare(kind, period);
    if (!payload) return;
    try {
      await Share.share({ message: payload.message, title: payload.title });
    } catch {
      showToast('Share cancelled', 'info');
    }
  }, [kind, period, prepareShare, showToast]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Export Data"
        subtitle="PDF · CSV · JSON"
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.section}>Report type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {KINDS.map((k) => (
          <Pressable
            key={k}
            onPress={() => {
              void hapticSelection();
              setKind(k);
            }}
            style={[styles.chip, kind === k && styles.chipActive]}
            {...buttonA11y(k)}
          >
            <Text style={[styles.chipText, kind === k && styles.chipTextActive]}>
              {k}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={[styles.section, styles.spaced]}>Format</Text>
      <View style={styles.row}>
        {FORMATS.map((f) => (
          <Pressable
            key={f}
            onPress={() => void runExport(f)}
            style={[styles.formatBtn, format === f && styles.formatActive]}
            {...buttonA11y(`Export ${f}`)}
          >
            <Text style={styles.formatText}>
              {f === 'pdf' ? 'PDF (placeholder)' : f.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.share} onPress={() => void onShare()} {...buttonA11y('Share report')}>
        <Text style={styles.shareText}>Share report</Text>
      </Pressable>

      {lastExport ? (
        <AppCard style={styles.preview}>
          <Text style={styles.file}>
            {lastExport.isPlaceholder ? '📎 ' : ''}
            {lastExport.filename}
          </Text>
          <Text style={styles.meta}>
            {exportStatus === 'loading'
              ? 'Generating…'
              : `Exported ${new Date(lastExport.exportedAt).toLocaleString()}`}
          </Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.content} maxFontSizeMultiplier={1.25}>
              {lastExport.content.slice(0, 4000)}
              {lastExport.content.length > 4000 ? '\n…' : ''}
            </Text>
          </ScrollView>
        </AppCard>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  chipTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  formatBtn: {
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  formatActive: { backgroundColor: Colors.primaryLight },
  formatText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  share: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '700',
  },
  preview: { maxHeight: 420 },
  file: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  scroll: { maxHeight: 320 },
  content: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontFamily: 'Courier',
  },
});
