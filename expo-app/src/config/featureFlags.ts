/**
 * Feature flags — frontend gates for gradual rollout.
 * Backend remote-config can hydrate `useAppConfigStore` later.
 */
export type FeatureFlagKey =
  | 'enableVideoSessions'
  | 'enableAiChat'
  | 'enableMoodTracking'
  | 'enableJournal'
  | 'enableWellness'
  | 'enableCareCredits'
  | 'enableTwoFactorAuth'
  | 'enableOfflineQueue'
  | 'enableAppSearch'
  | 'enableBiometricLogin'
  | 'enableDarkTheme'
  | 'enableMaintenanceMode'
  | 'enableForceUpdate'
  | 'enableOptionalUpdate'
  | 'enableAnalytics'
  | 'enableCrashReporting'
  | 'enableSimulateOffline'
  | 'enableInstitution'
  | 'enableEngagement'
  | 'enablePersonalization'
  | 'enableBetaExperiments'
  | 'enableMultiRole'
  | 'enableParentRole'
  | 'enableTrustedCircle'
  | 'enableCaregiverDashboard'
  | 'enableCommunity'
  | 'enableTherapistPortal'
  | 'enableDevTools'
  | 'enableGlobalErrorModal';

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableVideoSessions: true,
  enableAiChat: true,
  enableMoodTracking: true,
  enableJournal: true,
  enableWellness: true,
  enableCareCredits: true,
  enableTwoFactorAuth: true,
  enableOfflineQueue: true,
  enableAppSearch: true,
  enableBiometricLogin: true,
  enableDarkTheme: false,
  enableMaintenanceMode: false,
  enableForceUpdate: false,
  enableOptionalUpdate: false,
  enableAnalytics: false,
  enableCrashReporting: false,
  enableSimulateOffline: __DEV__,
  enableInstitution: true,
  enableEngagement: true,
  enablePersonalization: true,
  enableBetaExperiments: __DEV__,
  enableMultiRole: true,
  enableParentRole: false,
  enableTrustedCircle: true,
  enableCaregiverDashboard: true,
  enableCommunity: true,
  enableTherapistPortal: true,
  enableDevTools: __DEV__,
  enableGlobalErrorModal: true,
};

/** Experiment keys — mapped via enableBetaExperiments + remote later */
export type ExperimentKey =
  | 'home_adaptive_v2'
  | 'institution_campus_tab'
  | 'wellness_score_v1';

export const DEFAULT_EXPERIMENTS: Record<ExperimentKey, boolean> = {
  home_adaptive_v2: true,
  institution_campus_tab: true,
  wellness_score_v1: true,
};

/** @deprecated Prefer `DEFAULT_FEATURE_FLAGS` + `useFeatureFlag` */
export const featureFlags = DEFAULT_FEATURE_FLAGS;
