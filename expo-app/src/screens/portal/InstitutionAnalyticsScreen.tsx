import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  PortalStatStrip,
  PortalPlaceholderPanel,
} from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'InstitutionAnalytics'
  >;
};

export const InstitutionAnalyticsScreen: React.FC<Props> = ({
  navigation,
}) => {
  const institutionAnalytics = usePortalStore((s) => s.institutionAnalytics);
  const loadInstitutionAnalytics = usePortalStore(
    (s) => s.loadInstitutionAnalytics,
  );
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!institutionAnalytics) void loadSnapshot();
    else void loadInstitutionAnalytics();
  }, [institutionAnalytics, loadInstitutionAnalytics, loadSnapshot]);

  const max = Math.max(
    ...(institutionAnalytics?.series.map((s) => s.value) ?? [1]),
    1,
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Institution Analytics"
        subtitle={institutionAnalytics?.periodLabel ?? 'Placeholder series'}
        onBack={() => navigation.goBack()}
      />

      {institutionAnalytics?.placeholder ? (
        <View style={styles.panel}>
          <PortalPlaceholderPanel
            title={institutionAnalytics.title}
            message={institutionAnalytics.placeholderMessage}
            bullets={institutionAnalytics.notes}
          />
        </View>
      ) : null}

      {institutionAnalytics?.stats?.length ? (
        <View style={styles.stats}>
          <PortalStatStrip stats={institutionAnalytics.stats} />
        </View>
      ) : null}

      <Text style={styles.section}>Trend (mock)</Text>
      <AppCard style={styles.chart}>
        {(institutionAnalytics?.series ?? []).map((point) => (
          <View key={point.label} style={styles.barRow}>
            <Text style={styles.barLabel}>{point.label}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.round((point.value / max) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{point.value}</Text>
          </View>
        ))}
      </AppCard>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  panel: { marginBottom: Spacing.md },
  stats: { marginBottom: Spacing.md },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  chart: { gap: Spacing.sm },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    width: 72,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.borderDefault,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.pill,
  },
  barValue: {
    ...Typography.caption,
    color: Colors.textMuted,
    width: 28,
    textAlign: 'right',
  },
});
