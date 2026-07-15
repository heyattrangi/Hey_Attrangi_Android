import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUpBasic: undefined;
  OTPVerify: undefined;
  SetPassword: undefined;
  TrustedContact: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  PersonalWelcome: undefined;
  MoodCheck: undefined;
  ReasonTags: undefined;
  TherapyExperience: undefined;
  OnboardingComplete: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ChatTab: undefined;
  MoodTab: undefined;
  TherapistsTab: undefined;
  ProfileTab: undefined;
  InstitutionTab: undefined;
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  TherapistProfile: { therapistId: string; name: string };
  Booking: { therapistId: string; name: string };
  Payment: {
    therapistId: string;
    name: string;
    date: string;
    time: string;
    price: string;
    sessionType?: string;
  };
  BookingConfirmation: {
    therapistId: string;
    name: string;
    date: string;
    time: string;
    sessionType?: string;
    meetingUrl?: string;
  };
  Sessions: undefined;
  WaitingRoom: { sessionId: string; therapistName: string };
  SessionPermissions: { sessionId: string; therapistName: string };
  CameraPreview: { sessionId: string; therapistName: string };
  VideoSession: { sessionId: string; therapistName: string };
  SessionComplete: {
    sessionId: string;
    therapistName: string;
    durationMinutes: number;
  };
  SessionFeedback: { sessionId: string; therapistName: string };
  Settings: undefined;
  AppSearch: undefined;
  SearchHistory: undefined;
  PersonalInformation: undefined;
  EmailSecurity: undefined;
  Devices: undefined;
  Notifications: undefined;
  NotificationCenter: undefined;
  ActivityTimeline: undefined;
  BillingInvoices: undefined;
  Subscription: undefined;
  SubscriptionComparison: undefined;
  BillingHistory: undefined;
  BillingCheckout: {
    kind: 'subscription' | 'credits';
    planId?: import('../types/domain').SubscriptionPlanId;
    title: string;
    amount: number;
    amountLabel: string;
  };
  PaymentSuccess: {
    transactionId: string;
    receiptId: string;
    amountLabel: string;
    title: string;
    kind: 'subscription' | 'credits' | 'session';
  };
  PaymentFailure: { message?: string };
  Wallet: undefined;
  Refunds: undefined;
  RefundDetail: { refundId: string };
  InvoiceDetail: { invoiceId: string };
  CareCredits: undefined;
  AiCompanionSettings: undefined;
  ConversationHistory: undefined;
  ConversationSearch: undefined;
  ConversationExport: { conversationId: string };
  AiMemoryViewer: undefined;
  AiTimeline: undefined;
  ConversationTemplates: undefined;
  VoiceConversation: undefined;
  Appearance: undefined;
  Language: undefined;
  PrivacySecurity: undefined;
  Permissions: undefined;
  TrustedContacts: undefined;
  EmergencyContacts: undefined;
  TrustedCircle: undefined;
  InviteContact: undefined;
  RelationshipManagement: { memberId: string };
  CirclePermissions: undefined;
  EmergencySharing: undefined;
  WellnessSharing: undefined;
  GuardianView: undefined;
  CaregiverDashboard: undefined;
  BiometricLogin: undefined;
  HelpCenter: undefined;
  HelpArticle: { slug: string; title: string };
  AccountManagement: undefined;
  MoodHistory: undefined;
  MoodAnalytics: undefined;
  MoodCalendar: undefined;
  MoodDetail: { entryId: string };
  JournalHome: undefined;
  JournalEntry: { entryId?: string; templateId?: string };
  JournalTemplates: undefined;
  WellnessHub: undefined;
  BreathingExercise: { exerciseId?: 'box' | '478' | 'calming' };
  Affirmations: undefined;
  WellnessProgress: undefined;
  WellnessJourney: undefined;
  HabitTracking: undefined;
  PersonalInsights: undefined;
  RecommendationFeed: undefined;
  DashboardCustomize: undefined;
  ProgressDashboard: undefined;
  BadgeCollection: undefined;
  WeeklyChallenges: undefined;
  MonthlyGoals: undefined;
  EngagementRewards: undefined;
  MilestoneTimeline: undefined;
  InstitutionDashboard: undefined;
  InstitutionProfile: undefined;
  CampusPrograms: undefined;
  InstitutionAnnouncements: undefined;
  CampusResources: undefined;
  InstitutionNotifications: undefined;
  RoleSwitcher: undefined;
  StudentWellnessDashboard: undefined;
  WellnessReportsHub: undefined;
  WellnessReportsDashboard: undefined;
  ReportDetail: { kind: import('../types/domain').ReportKind };
  ReportExportData:
    | undefined
    | {
        kind?: import('../types/domain').ReportKind;
        format?: import('../types/domain').ReportExportFormat;
      };
  InstitutionReports: undefined;
  ParentReports: undefined;
  CommunityHome: undefined;
  CommunityDetail: { communityId: string };
  CommunityGroups: undefined;
  CommunityEvents: undefined;
  PeerDiscussions: undefined;
  AnonymousMode: undefined;
  ModerationQueue: undefined;
  ContentReport:
    | undefined
    | {
        targetType?: import('../types/domain').ContentReport['targetType'];
        targetId?: string;
        targetPreview?: string;
      };
  GroupWellness: undefined;
  SavedPosts: undefined;
  TherapistDashboard: undefined;
  TherapistSchedule: undefined;
  TherapistAppointments: undefined;
  TherapistAvailability: undefined;
  TherapistClientList: undefined;
  SessionNotesPlaceholder: { appointmentId: string };
  SessionAiSummaryPlaceholder: { appointmentId: string };
  PortalReports: undefined;
  AdminDashboard: undefined;
  InstitutionAnalytics: undefined;
  DevToolsMenu: undefined;
  ComponentGallery: undefined;
  ComponentShowcase: undefined;
  ThemePlayground: undefined;
  TypographyPreview: undefined;
  ColorPalettePreview: undefined;
  AnimationPreview: undefined;
  EmptyStateGallery: undefined;
  LoadingGallery: undefined;
  DialogGallery: undefined;
  FeatureToggle: undefined;
  MockApiSwitch: undefined;
  EnvironmentSwitch: undefined;
  DebugScreen: undefined;
  PerformanceMonitor: undefined;
  NetworkInspector: undefined;
  UiStatesDemo: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  MainApp: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
