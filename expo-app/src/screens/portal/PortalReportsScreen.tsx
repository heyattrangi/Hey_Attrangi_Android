import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PortalReports'>;
};

export const PortalReportsScreen: React.FC<Props> = ({ navigation }) => {
  const reports = usePortalStore((s) => s.reports);
  const status = usePortalStore((s) => s.status);
  const loadPortalReports = usePortalStore((s) => s.loadPortalReports);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!reports.length) void loadSnapshot();
    else void loadPortalReports();
  }, [loadPortalReports, loadSnapshot, reports.length]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Portal Reports"
        subtitle="Therapist / admin packs"
        onBack={() => navigation.goBack()}
      />
      {status === 'loading' && !reports.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {reports.map((report) => (
        <AppCard key={report.id} style={styles.card}>
          <Text style={[styles.badge, !report.available && styles.badgeSoon]}>
            {report.available ? 'Ready (mock)' : 'Soon'}
          </Text>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {report.title}
          </Text>
          <Text style={styles.sub}>{report.subtitle}</Text>
          <Text style={styles.period}>{report.periodLabel}</Text>
        </AppCard>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  card: { marginBottom: Spacing.sm, gap: 4 },
  badge: {
    alignSelf: 'flex-start',
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    backgroundColor: Colors.primaryLight,
    overflow: 'hidden',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: 4,
  },
  badgeSoon: {
    backgroundColor: Colors.peachMuted,
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  period: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
