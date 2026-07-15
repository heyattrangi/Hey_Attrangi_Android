import { UiStateAssets } from './assets';
import { EmptyKind, LoadingDomain, UiStateDefinition, UiStateKey } from './types';

/**
 * Exact copy + illustrations from Design folder PNGs.
 */
export const UI_STATE_CATALOG: Record<UiStateKey, UiStateDefinition> = {
  content: {
    key: 'content',
    title: '',
    presentation: 'inline',
  },
  loading: {
    key: 'loading',
    title: '',
    illustration: UiStateAssets.loadingHome,
    presentation: 'fullscreen',
  },
  skeleton: {
    key: 'skeleton',
    title: '',
    presentation: 'skeleton',
  },
  shimmer: {
    key: 'shimmer',
    title: '',
    presentation: 'shimmer',
  },
  'error.internet': {
    key: 'error.internet',
    title: "Uh-oh you're not connected to the internet!",
    illustration: UiStateAssets.internetError,
    presentation: 'fullscreen',
    primaryActionLabel: 'Try again',
  },
  'error.server': {
    key: 'error.server',
    title: "Oops! We're having trouble connecting to our servers.",
    illustration: UiStateAssets.serverError,
    presentation: 'fullscreen',
    primaryActionLabel: 'Try again',
  },
  'error.generic': {
    key: 'error.generic',
    title: 'Oops! Something went wrong.',
    illustration: UiStateAssets.genericError,
    presentation: 'fullscreen',
    primaryActionLabel: 'Try again',
  },
  'error.sessionExpired': {
    key: 'error.sessionExpired',
    title: 'Session Expired',
    message: 'Your session has expired. Please sign in again to continue.',
    illustration: UiStateAssets.sessionExpired,
    presentation: 'fullscreen',
    primaryActionLabel: 'Sign in',
  },
  'empty.chatHistory': {
    key: 'empty.chatHistory',
    title: 'No chat history',
    illustration: UiStateAssets.noChatHistory,
    presentation: 'fullscreen',
    primaryActionLabel: 'Start Chat',
  },
  'empty.sessions': {
    key: 'empty.sessions',
    title: 'No sessions scheduled yet',
    message: 'Book your first session.',
    illustration: UiStateAssets.noSessions,
    presentation: 'fullscreen',
    primaryActionLabel: 'Find a therapist',
    showArrow: true,
  },
  'empty.therapists': {
    key: 'empty.therapists',
    title: 'No therapists found',
    illustration: UiStateAssets.noTherapists,
    presentation: 'fullscreen',
  },
  'empty.searchResults': {
    key: 'empty.searchResults',
    title: 'No search results',
    illustration: UiStateAssets.noSearchResults,
    presentation: 'fullscreen',
    primaryActionLabel: 'Clear search',
  },
  'empty.notifications': {
    key: 'empty.notifications',
    title: 'No notifications',
    illustration: UiStateAssets.noNotifications,
    presentation: 'fullscreen',
  },
  'empty.careCredits': {
    key: 'empty.careCredits',
    title: 'No care credits',
    illustration: UiStateAssets.noCareCredits,
    presentation: 'fullscreen',
  },
  'empty.moodHistory': {
    key: 'empty.moodHistory',
    title: 'No mood history found',
    illustration: UiStateAssets.noMoodHistory,
    presentation: 'fullscreen',
    primaryActionLabel: 'Start Mood Tracking',
  },
  'empty.invoices': {
    key: 'empty.invoices',
    title: 'No invoices',
    illustration: UiStateAssets.noInvoices,
    presentation: 'fullscreen',
  },
  'success.booking': {
    key: 'success.booking',
    title: 'Confirmed Booking',
    illustration: UiStateAssets.bookingSuccess,
    presentation: 'fullscreen',
    primaryActionLabel: 'Go to schedule',
    showArrow: true,
  },
  'failure.booking': {
    key: 'failure.booking',
    title: 'Something went wrong while booking your session.',
    illustration: UiStateAssets.bookingFailed,
    presentation: 'fullscreen',
    primaryActionLabel: 'Try again',
  },
  'success.payment': {
    key: 'success.payment',
    title: 'Payment successful!',
    illustration: UiStateAssets.paymentSuccess,
    presentation: 'fullscreen',
    primaryActionLabel: 'Done',
  },
  'failure.payment': {
    key: 'failure.payment',
    title: 'Uh-oh your payment failed',
    illustration: UiStateAssets.paymentFailed,
    presentation: 'fullscreen',
    primaryActionLabel: 'Try again',
  },
  'success.moodSaved': {
    key: 'success.moodSaved',
    title: 'Mood Saved',
    illustration: UiStateAssets.moodSaved,
    presentation: 'fullscreen',
    primaryActionLabel: 'View mood history',
    showArrow: true,
  },
  'success.passwordChanged': {
    key: 'success.passwordChanged',
    title: 'Password changed!',
    message: 'Your password has been changed successfully.',
    presentation: 'dialog',
    primaryActionLabel: 'Done',
  },
  'success.sessionCancelled': {
    key: 'success.sessionCancelled',
    title: 'Session cancelled!',
    message: 'Your appointment has been cancelled successfully.',
    presentation: 'dialog',
    primaryActionLabel: 'Done',
  },
  'dialog.logout': {
    key: 'dialog.logout',
    title: 'Are you sure you want to log out?',
    illustration: UiStateAssets.logoutDialog,
    presentation: 'dialog',
    primaryActionLabel: 'Logout',
    secondaryActionLabel: 'Cancel',
  },
  'dialog.discardChanges': {
    key: 'dialog.discardChanges',
    title: 'Are you sure you want to discard your changes?',
    illustration: UiStateAssets.discardChanges,
    presentation: 'dialog',
    primaryActionLabel: 'Discard Changes',
    secondaryActionLabel: 'Cancel',
  },
  'dialog.cancelSession': {
    key: 'dialog.cancelSession',
    title: 'Are you sure you want to cancel the session?',
    illustration: UiStateAssets.cancelSession,
    presentation: 'dialog',
    primaryActionLabel: 'Reschedule instead?',
    secondaryActionLabel: 'Cancel session',
  },
  'dialog.deleteAccount': {
    key: 'dialog.deleteAccount',
    title: 'Delete your account?',
    message:
      'This permanently removes your profile, journal, and session history. This cannot be undone.',
    illustration: UiStateAssets.logoutDialog,
    presentation: 'dialog',
    primaryActionLabel: 'Delete Account',
    secondaryActionLabel: 'Keep Account',
  },
  'dialog.permissionRequired': {
    key: 'dialog.permissionRequired',
    title: 'Permission required',
    message:
      'Hey Attrangi needs this permission to continue. You can enable it in your device settings.',
    presentation: 'dialog',
    primaryActionLabel: 'Open Settings',
    secondaryActionLabel: 'Not Now',
  },
  'dialog.biometricSetup': {
    key: 'dialog.biometricSetup',
    title: 'Enable biometric login?',
    message:
      'Use Face ID or fingerprint to unlock Hey Attrangi faster. You can change this anytime in Security.',
    presentation: 'dialog',
    primaryActionLabel: 'Enable',
    secondaryActionLabel: 'Not Now',
  },
  'dialog.sessionExpired': {
    key: 'dialog.sessionExpired',
    title: 'Session expired',
    message: 'For your security, please sign in again to continue.',
    presentation: 'dialog',
    primaryActionLabel: 'Sign In',
  },
};

export const EMPTY_KIND_TO_STATE: Record<EmptyKind, UiStateKey> = {
  chatHistory: 'empty.chatHistory',
  sessions: 'empty.sessions',
  therapists: 'empty.therapists',
  notifications: 'empty.notifications',
  careCredits: 'empty.careCredits',
  moodHistory: 'empty.moodHistory',
  invoices: 'empty.invoices',
  searchResults: 'empty.searchResults',
};

export const LOADING_DOMAIN_ASSET: Record<LoadingDomain, typeof UiStateAssets.loadingHome> = {
  home: UiStateAssets.loadingHome,
  chat: UiStateAssets.loadingChat,
  therapist: UiStateAssets.loadingTherapist,
  session: UiStateAssets.loadingSession,
  profile: UiStateAssets.loadingProfile,
  invoice: UiStateAssets.loadingInvoice,
  default: UiStateAssets.loadingHome,
};

export const getUiStateDefinition = (key: UiStateKey): UiStateDefinition =>
  UI_STATE_CATALOG[key];
