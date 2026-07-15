import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { TherapistProfileScreen } from '../screens/therapists/TherapistProfileScreen';
import { BookingScreen } from '../screens/sessions/BookingScreen';
import { PaymentScreen } from '../screens/sessions/PaymentScreen';
import { BookingConfirmationScreen } from '../screens/sessions/BookingConfirmationScreen';
import { SessionsScreen } from '../screens/sessions/SessionsScreen';
import { WaitingRoomScreen } from '../screens/sessions/WaitingRoomScreen';
import { SessionPermissionsScreen } from '../screens/sessions/SessionPermissionsScreen';
import { CameraPreviewScreen } from '../screens/sessions/CameraPreviewScreen';
import { VideoSessionScreen } from '../screens/sessions/VideoSessionScreen';
import { SessionCompleteScreen } from '../screens/sessions/SessionCompleteScreen';
import { SessionFeedbackScreen } from '../screens/sessions/SessionFeedbackScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { PersonalInformationScreen } from '../screens/profile/PersonalInformationScreen';
import { EmailSecurityScreen } from '../screens/profile/EmailSecurityScreen';
import { DevicesScreen } from '../screens/profile/DevicesScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { NotificationCenterScreen } from '../screens/notifications/NotificationCenterScreen';
import { ActivityTimelineScreen } from '../screens/notifications/ActivityTimelineScreen';
import { BillingInvoicesScreen } from '../screens/profile/BillingInvoicesScreen';
import { SubscriptionScreen } from '../screens/billing/SubscriptionScreen';
import { SubscriptionComparisonScreen } from '../screens/billing/SubscriptionComparisonScreen';
import { BillingHistoryScreen } from '../screens/billing/BillingHistoryScreen';
import { BillingCheckoutScreen } from '../screens/billing/BillingCheckoutScreen';
import { PaymentSuccessScreen } from '../screens/billing/PaymentSuccessScreen';
import { PaymentFailureScreen } from '../screens/billing/PaymentFailureScreen';
import { WalletScreen } from '../screens/billing/WalletScreen';
import {
  RefundsScreen,
  RefundDetailScreen,
} from '../screens/billing/RefundsScreen';
import { InvoiceDetailScreen } from '../screens/profile/InvoiceDetailScreen';
import { CareCreditsScreen } from '../screens/profile/CareCreditsScreen';
import { AiCompanionSettingsScreen } from '../screens/profile/AiCompanionSettingsScreen';
import {
  ConversationHistoryScreen,
  ConversationSearchScreen,
  ConversationExportScreen,
  AiMemoryViewerScreen,
  AiTimelineScreen,
  ConversationTemplatesScreen,
  VoiceConversationScreen,
} from '../screens/ai-conversation';
import { AppearanceScreen } from '../screens/profile/AppearanceScreen';
import { LanguageScreen } from '../screens/profile/LanguageScreen';
import { PrivacySecurityScreen } from '../screens/profile/PrivacySecurityScreen';
import { PermissionsScreen } from '../screens/profile/PermissionsScreen';
import { TrustedContactsScreen } from '../screens/profile/TrustedContactsScreen';
import { EmergencyContactsScreen } from '../screens/profile/EmergencyContactsScreen';
import {
  TrustedCircleScreen,
  InviteContactScreen,
  RelationshipManagementScreen,
  CirclePermissionsScreen,
  EmergencySharingScreen,
  WellnessSharingScreen,
  GuardianViewScreen,
  CaregiverDashboardScreen,
} from '../screens/family';
import {
  CommunityHomeScreen,
  CommunityDetailScreen,
  CommunityGroupsScreen,
  CommunityEventsScreen,
  PeerDiscussionsScreen,
  AnonymousModeScreen,
  ModerationQueueScreen,
  ContentReportScreen,
  GroupWellnessScreen,
  SavedPostsScreen,
} from '../screens/community';
import {
  TherapistDashboardScreen,
  TherapistScheduleScreen,
  TherapistAppointmentsScreen,
  TherapistAvailabilityScreen,
  TherapistClientListScreen,
  SessionNotesPlaceholderScreen,
  SessionAiSummaryPlaceholderScreen,
  PortalReportsScreen,
  AdminDashboardScreen,
  InstitutionAnalyticsScreen,
} from '../screens/portal';
import {
  DevToolsMenuScreen,
  ComponentGalleryScreen,
  ComponentShowcaseScreen,
  ThemePlaygroundScreen,
  TypographyPreviewScreen,
  ColorPalettePreviewScreen,
  AnimationPreviewScreen,
  EmptyStateGalleryScreen,
  LoadingGalleryScreen,
  DialogGalleryScreen,
  FeatureToggleScreen,
  MockApiSwitchScreen,
  EnvironmentSwitchScreen,
  DebugScreen,
  PerformanceMonitorScreen,
  NetworkInspectorScreen,
} from '../screens/devtools';
import { BiometricLoginScreen } from '../screens/profile/BiometricLoginScreen';
import { HelpCenterScreen } from '../screens/profile/HelpCenterScreen';
import { HelpArticleScreen } from '../screens/profile/HelpArticleScreen';
import { AccountManagementScreen } from '../screens/profile/AccountManagementScreen';
import { MoodHistoryScreen } from '../screens/mood/MoodHistoryScreen';
import { MoodAnalyticsScreen } from '../screens/mood/MoodAnalyticsScreen';
import { MoodCalendarScreen } from '../screens/mood/MoodCalendarScreen';
import { MoodDetailScreen } from '../screens/mood/MoodDetailScreen';
import { JournalHomeScreen } from '../screens/journal/JournalHomeScreen';
import { JournalEntryScreen } from '../screens/journal/JournalEntryScreen';
import { JournalTemplatesScreen } from '../screens/journal/JournalTemplatesScreen';
import { WellnessHubScreen } from '../screens/wellness/WellnessHubScreen';
import { BreathingExerciseScreen } from '../screens/wellness/BreathingExerciseScreen';
import { AffirmationsScreen } from '../screens/wellness/AffirmationsScreen';
import { WellnessProgressScreen } from '../screens/wellness/WellnessProgressScreen';
import { UiStatesDemoScreen } from '../screens/dev/UiStatesDemoScreen';
import { AppSearchScreen } from '../screens/search/AppSearchScreen';
import { SearchHistoryScreen } from '../screens/search/SearchHistoryScreen';
import {
  WellnessJourneyScreen,
  HabitTrackingScreen,
  PersonalInsightsScreen,
  RecommendationFeedScreen,
  DashboardCustomizeScreen,
} from '../screens/personalization-engine';
import {
  ProgressDashboardScreen,
  BadgeCollectionScreen,
  WeeklyChallengesScreen,
  MonthlyGoalsScreen,
  EngagementRewardsScreen,
  MilestoneTimelineScreen,
} from '../screens/engagement';
import {
  InstitutionDashboardScreen,
  InstitutionProfileScreen,
  CampusProgramsScreen,
  InstitutionAnnouncementsScreen,
  CampusResourcesScreen,
  InstitutionNotificationsScreen,
  RoleSwitcherScreen,
  StudentWellnessDashboardScreen,
} from '../screens/institution';
import {
  WellnessReportsHubScreen,
  WellnessReportsDashboardScreen,
  ReportDetailScreen,
  ReportExportDataScreen,
  InstitutionReportsScreen,
  ParentReportsScreen,
} from '../screens/reports';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainAppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      fullScreenGestureEnabled: true,
      gestureEnabled: true,
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen name="TherapistProfile" component={TherapistProfileScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    <Stack.Screen name="Sessions" component={SessionsScreen} />
    <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
    <Stack.Screen
      name="SessionPermissions"
      component={SessionPermissionsScreen}
    />
    <Stack.Screen name="CameraPreview" component={CameraPreviewScreen} />
    <Stack.Screen
      name="VideoSession"
      component={VideoSessionScreen}
      options={{ presentation: 'fullScreenModal', animation: 'fade' }}
    />
    <Stack.Screen name="SessionComplete" component={SessionCompleteScreen} />
    <Stack.Screen name="SessionFeedback" component={SessionFeedbackScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="AppSearch" component={AppSearchScreen} />
    <Stack.Screen name="SearchHistory" component={SearchHistoryScreen} />
    <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
    <Stack.Screen name="EmailSecurity" component={EmailSecurityScreen} />
    <Stack.Screen name="Devices" component={DevicesScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
    <Stack.Screen name="ActivityTimeline" component={ActivityTimelineScreen} />
    <Stack.Screen name="BillingInvoices" component={BillingInvoicesScreen} />
    <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    <Stack.Screen
      name="SubscriptionComparison"
      component={SubscriptionComparisonScreen}
    />
    <Stack.Screen name="BillingHistory" component={BillingHistoryScreen} />
    <Stack.Screen name="BillingCheckout" component={BillingCheckoutScreen} />
    <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} />
    <Stack.Screen name="Wallet" component={WalletScreen} />
    <Stack.Screen name="Refunds" component={RefundsScreen} />
    <Stack.Screen name="RefundDetail" component={RefundDetailScreen} />
    <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
    <Stack.Screen name="CareCredits" component={CareCreditsScreen} />
    <Stack.Screen name="AiCompanionSettings" component={AiCompanionSettingsScreen} />
    <Stack.Screen name="ConversationHistory" component={ConversationHistoryScreen} />
    <Stack.Screen name="ConversationSearch" component={ConversationSearchScreen} />
    <Stack.Screen name="ConversationExport" component={ConversationExportScreen} />
    <Stack.Screen name="AiMemoryViewer" component={AiMemoryViewerScreen} />
    <Stack.Screen name="AiTimeline" component={AiTimelineScreen} />
    <Stack.Screen name="ConversationTemplates" component={ConversationTemplatesScreen} />
    <Stack.Screen name="VoiceConversation" component={VoiceConversationScreen} />
    <Stack.Screen name="Appearance" component={AppearanceScreen} />
    <Stack.Screen name="Language" component={LanguageScreen} />
    <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
    <Stack.Screen name="Permissions" component={PermissionsScreen} />
    <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
    <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
    <Stack.Screen name="TrustedCircle" component={TrustedCircleScreen} />
    <Stack.Screen name="InviteContact" component={InviteContactScreen} />
    <Stack.Screen
      name="RelationshipManagement"
      component={RelationshipManagementScreen}
    />
    <Stack.Screen name="CirclePermissions" component={CirclePermissionsScreen} />
    <Stack.Screen name="EmergencySharing" component={EmergencySharingScreen} />
    <Stack.Screen name="WellnessSharing" component={WellnessSharingScreen} />
    <Stack.Screen name="GuardianView" component={GuardianViewScreen} />
    <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboardScreen} />
    <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
    <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
    <Stack.Screen name="CommunityGroups" component={CommunityGroupsScreen} />
    <Stack.Screen name="CommunityEvents" component={CommunityEventsScreen} />
    <Stack.Screen name="PeerDiscussions" component={PeerDiscussionsScreen} />
    <Stack.Screen name="AnonymousMode" component={AnonymousModeScreen} />
    <Stack.Screen name="ModerationQueue" component={ModerationQueueScreen} />
    <Stack.Screen name="ContentReport" component={ContentReportScreen} />
    <Stack.Screen name="GroupWellness" component={GroupWellnessScreen} />
    <Stack.Screen name="SavedPosts" component={SavedPostsScreen} />
    <Stack.Screen name="TherapistDashboard" component={TherapistDashboardScreen} />
    <Stack.Screen name="TherapistSchedule" component={TherapistScheduleScreen} />
    <Stack.Screen
      name="TherapistAppointments"
      component={TherapistAppointmentsScreen}
    />
    <Stack.Screen
      name="TherapistAvailability"
      component={TherapistAvailabilityScreen}
    />
    <Stack.Screen
      name="TherapistClientList"
      component={TherapistClientListScreen}
    />
    <Stack.Screen
      name="SessionNotesPlaceholder"
      component={SessionNotesPlaceholderScreen}
    />
    <Stack.Screen
      name="SessionAiSummaryPlaceholder"
      component={SessionAiSummaryPlaceholderScreen}
    />
    <Stack.Screen name="PortalReports" component={PortalReportsScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen
      name="InstitutionAnalytics"
      component={InstitutionAnalyticsScreen}
    />
    <Stack.Screen name="BiometricLogin" component={BiometricLoginScreen} />
    <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    <Stack.Screen name="HelpArticle" component={HelpArticleScreen} />
    <Stack.Screen name="AccountManagement" component={AccountManagementScreen} />
    <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
    <Stack.Screen name="MoodAnalytics" component={MoodAnalyticsScreen} />
    <Stack.Screen name="MoodCalendar" component={MoodCalendarScreen} />
    <Stack.Screen name="MoodDetail" component={MoodDetailScreen} />
    <Stack.Screen name="JournalHome" component={JournalHomeScreen} />
    <Stack.Screen
      name="JournalEntry"
      component={JournalEntryScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen name="JournalTemplates" component={JournalTemplatesScreen} />
    <Stack.Screen name="WellnessHub" component={WellnessHubScreen} />
    <Stack.Screen
      name="BreathingExercise"
      component={BreathingExerciseScreen}
      options={{ presentation: 'modal', animation: 'fade' }}
    />
    <Stack.Screen name="Affirmations" component={AffirmationsScreen} />
    <Stack.Screen name="WellnessProgress" component={WellnessProgressScreen} />
    <Stack.Screen name="WellnessJourney" component={WellnessJourneyScreen} />
    <Stack.Screen name="HabitTracking" component={HabitTrackingScreen} />
    <Stack.Screen name="PersonalInsights" component={PersonalInsightsScreen} />
    <Stack.Screen name="RecommendationFeed" component={RecommendationFeedScreen} />
    <Stack.Screen name="DashboardCustomize" component={DashboardCustomizeScreen} />
    <Stack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
    <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen} />
    <Stack.Screen name="WeeklyChallenges" component={WeeklyChallengesScreen} />
    <Stack.Screen name="MonthlyGoals" component={MonthlyGoalsScreen} />
    <Stack.Screen name="EngagementRewards" component={EngagementRewardsScreen} />
    <Stack.Screen name="MilestoneTimeline" component={MilestoneTimelineScreen} />
    <Stack.Screen name="InstitutionDashboard" component={InstitutionDashboardScreen} />
    <Stack.Screen name="InstitutionProfile" component={InstitutionProfileScreen} />
    <Stack.Screen name="CampusPrograms" component={CampusProgramsScreen} />
    <Stack.Screen
      name="InstitutionAnnouncements"
      component={InstitutionAnnouncementsScreen}
    />
    <Stack.Screen name="CampusResources" component={CampusResourcesScreen} />
    <Stack.Screen
      name="InstitutionNotifications"
      component={InstitutionNotificationsScreen}
    />
    <Stack.Screen name="RoleSwitcher" component={RoleSwitcherScreen} />
    <Stack.Screen
      name="StudentWellnessDashboard"
      component={StudentWellnessDashboardScreen}
    />
    <Stack.Screen name="WellnessReportsHub" component={WellnessReportsHubScreen} />
    <Stack.Screen
      name="WellnessReportsDashboard"
      component={WellnessReportsDashboardScreen}
    />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    <Stack.Screen name="ReportExportData" component={ReportExportDataScreen} />
    <Stack.Screen name="InstitutionReports" component={InstitutionReportsScreen} />
    <Stack.Screen name="ParentReports" component={ParentReportsScreen} />
    <Stack.Screen name="DevToolsMenu" component={DevToolsMenuScreen} />
    <Stack.Screen name="ComponentGallery" component={ComponentGalleryScreen} />
    <Stack.Screen name="ComponentShowcase" component={ComponentShowcaseScreen} />
    <Stack.Screen name="ThemePlayground" component={ThemePlaygroundScreen} />
    <Stack.Screen name="TypographyPreview" component={TypographyPreviewScreen} />
    <Stack.Screen
      name="ColorPalettePreview"
      component={ColorPalettePreviewScreen}
    />
    <Stack.Screen name="AnimationPreview" component={AnimationPreviewScreen} />
    <Stack.Screen name="EmptyStateGallery" component={EmptyStateGalleryScreen} />
    <Stack.Screen name="LoadingGallery" component={LoadingGalleryScreen} />
    <Stack.Screen name="DialogGallery" component={DialogGalleryScreen} />
    <Stack.Screen name="FeatureToggle" component={FeatureToggleScreen} />
    <Stack.Screen name="MockApiSwitch" component={MockApiSwitchScreen} />
    <Stack.Screen name="EnvironmentSwitch" component={EnvironmentSwitchScreen} />
    <Stack.Screen name="DebugScreen" component={DebugScreen} />
    <Stack.Screen
      name="PerformanceMonitor"
      component={PerformanceMonitorScreen}
    />
    <Stack.Screen name="NetworkInspector" component={NetworkInspectorScreen} />
    <Stack.Screen name="UiStatesDemo" component={UiStatesDemoScreen} />
  </Stack.Navigator>
);
