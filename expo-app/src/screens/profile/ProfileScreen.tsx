import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen } from '../../components/app';
import { ProfileCard } from '../../components/ui/ProfileCard';
import { SettingsItem } from '../../components/ui/SettingsItem';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Icon } from '../../components/app/Icon';
import { LogoutDialog } from '../../components/ui/dialogs';
import {
  ProfileCompletionBar,
  SkeletonProfileHub,
} from '../../components/profile';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { computeProfileCompletion } from '../../store/preferencesStore';
import { ageFromDateOfBirth } from '../../services/profile/profileMappers';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { Icons } from '../../theme/icons';
import { buttonA11y } from '../../utils/accessibility';

type ProfileNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ProfileTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const MENU_SECTIONS: Array<{
  title: string;
  items: Array<{ label: string; screen: keyof MainStackParamList }>;
}> = [
  {
    title: 'Profile',
    items: [
      { label: 'Personal Information', screen: 'PersonalInformation' },
      { label: 'Email & Security', screen: 'EmailSecurity' },
      { label: 'Notifications', screen: 'Notifications' },
      { label: 'Billing & Invoices', screen: 'BillingInvoices' },
      { label: 'Care Credits', screen: 'CareCredits' },
    ],
  },
  {
    title: 'Institution',
    items: [
      { label: 'Campus Dashboard', screen: 'InstitutionDashboard' },
      { label: 'Institution Profile', screen: 'InstitutionProfile' },
      { label: 'Campus Programs', screen: 'CampusPrograms' },
      { label: 'Announcements', screen: 'InstitutionAnnouncements' },
      { label: 'Campus Resources', screen: 'CampusResources' },
      { label: 'Campus Notifications', screen: 'InstitutionNotifications' },
      { label: 'Student Wellness', screen: 'StudentWellnessDashboard' },
      { label: 'Switch Role', screen: 'RoleSwitcher' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Community Home', screen: 'CommunityHome' },
      { label: 'Groups', screen: 'CommunityGroups' },
      { label: 'Events', screen: 'CommunityEvents' },
      { label: 'Peer Discussions', screen: 'PeerDiscussions' },
      { label: 'Anonymous Mode', screen: 'AnonymousMode' },
      { label: 'Saved Posts', screen: 'SavedPosts' },
      { label: 'Group Wellness', screen: 'GroupWellness' },
      { label: 'Moderation Queue', screen: 'ModerationQueue' },
      { label: 'Report Content', screen: 'ContentReport' },
    ],
  },
  {
    title: 'Therapist / Admin portal',
    items: [
      { label: 'Therapist Dashboard', screen: 'TherapistDashboard' },
      { label: 'Schedule', screen: 'TherapistSchedule' },
      { label: 'Appointments', screen: 'TherapistAppointments' },
      { label: 'Availability', screen: 'TherapistAvailability' },
      { label: 'Client List', screen: 'TherapistClientList' },
      { label: 'Portal Reports', screen: 'PortalReports' },
      { label: 'Admin Dashboard', screen: 'AdminDashboard' },
      { label: 'Institution Analytics', screen: 'InstitutionAnalytics' },
    ],
  },
  {
    title: 'Developer',
    items: [
      { label: 'Developer Menu', screen: 'DevToolsMenu' },
      { label: 'Component Gallery', screen: 'ComponentGallery' },
      { label: 'Component Showcase', screen: 'ComponentShowcase' },
      { label: 'Feature Toggles', screen: 'FeatureToggle' },
      { label: 'Mock API Switch', screen: 'MockApiSwitch' },
      { label: 'Environment Switch', screen: 'EnvironmentSwitch' },
      { label: 'Debug Screen', screen: 'DebugScreen' },
      { label: 'Performance Monitor', screen: 'PerformanceMonitor' },
      { label: 'Network Inspector', screen: 'NetworkInspector' },
      { label: 'UI States (QA)', screen: 'UiStatesDemo' },
    ],
  },
  {
    title: 'Family & trusted circle',
    items: [
      { label: 'Trusted Circle', screen: 'TrustedCircle' },
      { label: 'Invite Contact', screen: 'InviteContact' },
      { label: 'Trusted Contacts', screen: 'TrustedContacts' },
      { label: 'Emergency Contacts', screen: 'EmergencyContacts' },
      { label: 'Circle Permissions', screen: 'CirclePermissions' },
      { label: 'Emergency Sharing', screen: 'EmergencySharing' },
      { label: 'Wellness Sharing', screen: 'WellnessSharing' },
      { label: 'Guardian View', screen: 'GuardianView' },
      { label: 'Caregiver Dashboard', screen: 'CaregiverDashboard' },
    ],
  },
  {
    title: 'Care & personalization',
    items: [
      { label: 'Wellness Reports', screen: 'WellnessReportsHub' },
      { label: 'Wellness Dashboard', screen: 'WellnessReportsDashboard' },
      { label: 'Export Wellness Data', screen: 'ReportExportData' },
      { label: 'Institution Reports', screen: 'InstitutionReports' },
      { label: 'Parent Reports', screen: 'ParentReports' },
      { label: 'Progress Dashboard', screen: 'ProgressDashboard' },
      { label: 'Badge Collection', screen: 'BadgeCollection' },
      { label: 'Weekly Challenges', screen: 'WeeklyChallenges' },
      { label: 'Monthly Goals', screen: 'MonthlyGoals' },
      { label: 'Rewards', screen: 'EngagementRewards' },
      { label: 'Growth Timeline', screen: 'MilestoneTimeline' },
      { label: 'Wellness Journey', screen: 'WellnessJourney' },
      { label: 'Habit Tracking', screen: 'HabitTracking' },
      { label: 'Personal Insights', screen: 'PersonalInsights' },
      { label: 'Recommendation Feed', screen: 'RecommendationFeed' },
      { label: 'Customize Dashboard', screen: 'DashboardCustomize' },
      { label: 'Journal', screen: 'JournalHome' },
      { label: 'Wellness Hub', screen: 'WellnessHub' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'AI Companion Settings', screen: 'AiCompanionSettings' },
      { label: 'Conversation History', screen: 'ConversationHistory' },
      { label: 'AI Memory', screen: 'AiMemoryViewer' },
      { label: 'AI Timeline', screen: 'AiTimeline' },
      { label: 'Conversation Templates', screen: 'ConversationTemplates' },
      { label: 'Notification Center', screen: 'NotificationCenter' },
      { label: 'Activity Timeline', screen: 'ActivityTimeline' },
      { label: 'Privacy & Security', screen: 'PrivacySecurity' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Search', screen: 'AppSearch' },
      { label: 'Appearance', screen: 'Appearance' },
      { label: 'Language', screen: 'Language' },
      { label: 'Settings', screen: 'Settings' },
    ],
  },
  {
    title: 'Billing',
    items: [
      { label: 'Billing History', screen: 'BillingHistory' },
      { label: 'Wallet', screen: 'Wallet' },
      { label: 'Refunds', screen: 'Refunds' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', screen: 'HelpCenter' },
      { label: 'Account Management', screen: 'AccountManagement' },
    ],
  },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNav>();
  const logout = useAuthStore((s) => s.logout);
  const personalInfo = useProfileStore((s) => s.personalInfo);
  const status = useProfileStore((s) => s.status);
  const initialize = useProfileStore((s) => s.initialize);
  const isHydrated = useProfileStore((s) => s.isHydrated);
  const [logoutVisible, setLogoutVisible] = useState(false);

  useEffect(() => {
    if (isHydrated && status === 'idle') {
      void initialize();
    }
  }, [initialize, isHydrated, status]);

  const completion = useMemo(
    () => computeProfileCompletion(personalInfo),
    [personalInfo],
  );

  const age =
    personalInfo.age ||
    (ageFromDateOfBirth(personalInfo.dateOfBirth)?.toString() ?? '');

  const subtitleParts = [
    personalInfo.username ? `@${personalInfo.username}` : null,
    age ? `${age} yrs` : null,
    personalInfo.gender || null,
    personalInfo.institution || null,
  ].filter(Boolean);

  const showSkeleton =
    (status === 'loading' || status === 'idle') && !personalInfo.fullName;

  return (
    <AppScreen gradient="topRightWarm">
      <Text style={styles.title} accessibilityRole="header">
        Profile
      </Text>
      <Text style={styles.subtitle}>Manage your profile</Text>

      {showSkeleton ? (
        <SkeletonProfileHub />
      ) : (
        <>
          <ProfileCard
            name={personalInfo.fullName || 'Your name'}
            email={personalInfo.email}
            phone={personalInfo.phone}
            subtitle={subtitleParts.join(' · ')}
            imageUrl={personalInfo.profileImageUrl}
            onPress={() => navigation.navigate('PersonalInformation')}
            style={styles.card}
          />

          {personalInfo.bio ? (
            <View style={styles.bioCard} accessibilityLabel={`Bio: ${personalInfo.bio}`}>
              <Text style={styles.bioLabel}>Bio</Text>
              <Text style={styles.bioText} maxFontSizeMultiplier={1.4}>
                {personalInfo.bio}
              </Text>
            </View>
          ) : null}

          <ProfileCompletionBar
            percent={completion.percent}
            missing={completion.missing}
          />

          <PrimaryButton
            label="Edit Profile"
            onPress={() => navigation.navigate('PersonalInformation')}
            style={styles.editCta}
          />

          {MENU_SECTIONS.map((section) => {
            const designCore = section.title === 'Profile';
            return (
              <View key={section.title} style={styles.section}>
                {designCore ? null : (
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                <View style={designCore ? styles.designMenu : styles.menu}>
                  {section.items.map((item, index) => (
                    <SettingsItem
                      key={`${section.title}-${item.screen}`}
                      label={item.label}
                      showDivider={designCore ? true : index > 0}
                      showChevron={!designCore}
                      onPress={() =>
                        navigation.navigate(item.screen as never)
                      }
                    />
                  ))}
                  {designCore ? <View style={styles.designMenuEnd} /> : null}
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutVisible(true)}
            activeOpacity={0.7}
            {...buttonA11y('Log out')}
          >
            <Icon name={Icons.logout} size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </>
      )}

      <LogoutDialog
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          void logout();
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.md,
  },
  bioCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bioLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  bioText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  editCta: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    paddingHorizontal: Spacing.lg,
  },
  /** Design Profile.png — flat divider list, no card chrome / chevrons */
  designMenu: {
    marginTop: Spacing.sm,
  },
  designMenuEnd: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderDefault,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  logoutText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});
