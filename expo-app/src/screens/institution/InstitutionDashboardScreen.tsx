import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl, Pressable } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  WellnessOverviewStrip,
  InstitutionQuickActions,
  AnnouncementCard,
  ProgramCard,
  StudentWellnessCards,
  InstitutionEmpty,
  InstitutionSkeletons,
} from '../../components/institution';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSelection } from '../../utils/haptics';
import { roleLabel } from '../../institution/roleConfigs';
import { Icon } from '../../components/app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'InstitutionTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

type StackProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'InstitutionDashboard'>;
};

export const InstitutionDashboardScreen: React.FC<Partial<StackProps>> = ({
  navigation: stackNav,
}) => {
  const tabNav = useNavigation<Nav>();
  const navigation = (stackNav ?? tabNav) as Nav;

  const status = useInstitutionStore((s) => s.status);
  const profile = useInstitutionStore((s) => s.profile);
  const wellnessOverview = useInstitutionStore((s) => s.wellnessOverview);
  const announcements = useInstitutionStore((s) => s.announcements);
  const programs = useInstitutionStore((s) => s.programs);
  const supportContacts = useInstitutionStore((s) => s.supportContacts);
  const emergencyContacts = useInstitutionStore((s) => s.emergencyContacts);
  const studentWellness = useInstitutionStore((s) => s.studentWellness);
  const roleConfig = useInstitutionStore((s) => s.roleConfig);
  const activeRoleId = useInstitutionStore((s) => s.activeRoleId);
  const loadSnapshot = useInstitutionStore((s) => s.loadSnapshot);
  const markAnnouncementRead = useInstitutionStore((s) => s.markAnnouncementRead);
  const registerProgram = useInstitutionStore((s) => s.registerProgram);

  useEffect(() => {
    if (status === 'idle') void loadSnapshot();
  }, [loadSnapshot, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadSnapshot);

  const navigateLoose = useCallback(
    (route: string) => {
      void hapticSelection();
      if (
        route === 'MoodTab' ||
        route === 'ChatTab' ||
        route === 'TherapistsTab' ||
        route === 'HomeTab' ||
        route === 'ProfileTab' ||
        route === 'InstitutionTab'
      ) {
        navigation.navigate(route as keyof MainTabParamList);
        return;
      }
      (navigation.navigate as (a: string) => void)(route);
    },
    [navigation],
  );

  return (
    <AppScreen
      gradient="topRightWarm"
      includeBottomInset={!stackNav}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {stackNav ? (
        <AppHeader
          title="Institution"
          onBack={() => stackNav.goBack()}
        />
      ) : (
        <View style={styles.headerRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{profile?.logoLabel ?? '—'}</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.instName} maxFontSizeMultiplier={1.35}>
              {profile?.name ?? 'Institution'}
            </Text>
            <Text style={styles.roleLine}>
              Viewing as {roleLabel(activeRoleId)}
            </Text>
          </View>
          <Pressable
            style={styles.switchBtn}
            onPress={() => navigation.navigate('RoleSwitcher')}
            {...buttonA11y('Switch role')}
          >
            <Icon name="account-switch-outline" size={22} color={Colors.primary} />
          </Pressable>
        </View>
      )}

      {status === 'loading' && !profile ? (
        <InstitutionSkeletons variant="dashboard" />
      ) : !profile || !wellnessOverview || !roleConfig ? (
        <InstitutionEmpty kind="dashboard" />
      ) : (
        <>
          <WellnessOverviewStrip overview={wellnessOverview} />

          <SectionHeader title="Quick actions" />
          <InstitutionQuickActions
            config={roleConfig}
            onAction={navigateLoose}
          />

          {roleConfig.showStudentWellness && studentWellness ? (
            <>
              <SectionHeader
                title="Student wellness"
                subtitle="Campus care cards — SIS later"
              />
              <StudentWellnessCards
                overview={studentWellness}
                onPressMood={() => navigation.navigate('MoodTab')}
                onPressSessions={() => navigation.navigate('Sessions')}
                onPressGoals={() => navigation.navigate('ProgressDashboard')}
              />
            </>
          ) : null}

          <SectionHeader
            title="Announcements"
            actionLabel="All"
            onAction={() => navigation.navigate('InstitutionAnnouncements')}
          />
          {announcements.length === 0 ? (
            <InstitutionEmpty kind="announcements" compact />
          ) : (
            announcements.slice(0, 3).map((a, i) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                index={i}
                onPress={(item) => {
                  void markAnnouncementRead(item.id);
                  navigation.navigate('InstitutionAnnouncements');
                }}
              />
            ))
          )}

          <SectionHeader
            title="Upcoming programs"
            actionLabel="Browse"
            onAction={() => navigation.navigate('CampusPrograms')}
          />
          {programs.length === 0 ? (
            <InstitutionEmpty kind="events" compact />
          ) : (
            programs.slice(0, 2).map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                onRegister={(prog) => {
                  if (!prog.registered) void registerProgram(prog.id);
                }}
              />
            ))
          )}

          <SectionHeader
            title="Campus resources"
            actionLabel="Open"
            onAction={() => navigation.navigate('CampusResources')}
          />
          <Pressable
            style={styles.linkCard}
            onPress={() => navigation.navigate('CampusResources')}
            {...buttonA11y('Open campus resources')}
          >
            <Icon name="lifebuoy" size={20} color={Colors.primary} />
            <Text style={styles.linkText}>
              Helpline · counselling · maps · support email
            </Text>
          </Pressable>

          <SectionHeader title="Support contacts" />
          {supportContacts.map((c) => (
            <View key={c.id} style={styles.contact}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactRole}>{c.role}</Text>
              {c.availableHours ? (
                <Text style={styles.contactMeta}>{c.availableHours}</Text>
              ) : null}
            </View>
          ))}

          <SectionHeader title="Emergency contacts" />
          {emergencyContacts.map((c) => (
            <View
              key={c.id}
              style={[styles.contact, c.important && styles.emergency]}
            >
              <Text style={styles.contactName}>{c.label}</Text>
              <Text style={styles.contactRole}>{c.value}</Text>
            </View>
          ))}

          <View style={styles.footerLinks}>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('InstitutionProfile')}
              accessibilityRole="link"
            >
              Institution profile
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('InstitutionNotifications')}
              accessibilityRole="link"
            >
              Campus notifications
            </Text>
          </View>
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...Typography.label,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  headerCopy: { flex: 1 },
  instName: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  roleLine: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  switchBtn: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: MIN_TOUCH_TARGET,
    marginBottom: Spacing.md,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '600',
  },
  contact: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
  },
  emergency: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(229, 62, 62, 0.06)',
  },
  contactName: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  contactRole: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  contactMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  footerLink: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  dot: { ...Typography.caption, color: Colors.textMuted },
});
