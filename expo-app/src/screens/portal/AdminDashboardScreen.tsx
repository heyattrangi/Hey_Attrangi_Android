import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PortalStatStrip } from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AdminDashboard'>;
};

export const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const adminDashboard = usePortalStore((s) => s.adminDashboard);
  const loadAdminDashboard = usePortalStore((s) => s.loadAdminDashboard);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);
  const enabled = useFeatureFlag('enableTherapistPortal');

  useEffect(() => {
    if (!adminDashboard) void loadSnapshot();
    else void loadAdminDashboard();
  }, [adminDashboard, loadAdminDashboard, loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Admin Dashboard"
        subtitle="Operations overview"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {enabled ? 'UI ready · backend later' : 'Feature flagged off'}
        </Text>
      </View>

      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle} maxFontSizeMultiplier={1.35}>
          {adminDashboard?.title ?? 'Institution admin'}
        </Text>
      </AppCard>

      {adminDashboard?.stats?.length ? (
        <View style={styles.stats}>
          <PortalStatStrip stats={adminDashboard.stats} />
        </View>
      ) : null}

      <Text style={styles.section}>Alerts</Text>
      {(adminDashboard?.alerts ?? []).map((alert) => (
        <Text key={alert} style={styles.alert}>
          · {alert}
        </Text>
      ))}

      <Text style={[styles.section, styles.spaced]}>Quick links</Text>
      <View style={styles.quick}>
        {(adminDashboard?.quickLinks ?? []).map((link) => (
          <Pressable
            key={link.id}
            style={styles.chip}
            onPress={() => {
              void hapticSelection();
              navigateHint(navigation, link.routeHint);
            }}
            {...buttonA11y(link.label)}
          >
            <Text style={styles.chipText}>{link.label}</Text>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
};

function navigateHint(
  navigation: NativeStackNavigationProp<MainStackParamList, 'AdminDashboard'>,
  hint: string,
) {
  switch (hint) {
    case 'InstitutionAnalytics':
      navigation.navigate('InstitutionAnalytics');
      break;
    case 'PortalReports':
      navigation.navigate('PortalReports');
      break;
    case 'TherapistDashboard':
      navigation.navigate('TherapistDashboard');
      break;
    case 'ModerationQueue':
      navigation.navigate('ModerationQueue');
      break;
    case 'InstitutionDashboard':
      navigation.navigate('InstitutionDashboard');
      break;
    default:
      navigation.navigate('InstitutionAnalytics');
  }
}

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
  hero: { marginBottom: Spacing.md },
  heroTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  stats: { marginBottom: Spacing.md },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  alert: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
