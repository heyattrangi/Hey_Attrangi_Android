import { ImageSourcePropType } from 'react-native';
import { UiStateAssets } from '../../../app/ui-states/assets';
import { LoadingDomain } from '../../../app/ui-states';

export type EmptyVariant =
  | 'chatHistory'
  | 'sessions'
  | 'therapists'
  | 'searchResults'
  | 'notifications'
  | 'careCredits'
  | 'moodHistory'
  | 'invoices';

export type ErrorVariant =
  | 'server'
  | 'generic'
  | 'sessionExpired'
  | 'booking'
  | 'payment';

export type SuccessVariant =
  | 'booking'
  | 'payment'
  | 'moodSaved'
  | 'passwordChanged'
  | 'sessionCancelled';

export interface StateVariantConfig {
  title: string;
  message?: string;
  illustration?: ImageSourcePropType;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showArrow?: boolean;
  titleAccent?: boolean;
}

export const LOADING_VARIANTS: Record<LoadingDomain, ImageSourcePropType> = {
  home: UiStateAssets.loadingHome,
  chat: UiStateAssets.loadingChat,
  therapist: UiStateAssets.loadingTherapist,
  session: UiStateAssets.loadingSession,
  profile: UiStateAssets.loadingProfile,
  invoice: UiStateAssets.loadingInvoice,
  default: UiStateAssets.loadingHome,
};

export const EMPTY_VARIANTS: Record<EmptyVariant, StateVariantConfig> = {
  chatHistory: {
    title: 'No chat history',
    illustration: UiStateAssets.noChatHistory,
    primaryActionLabel: 'Start Chat',
  },
  sessions: {
    title: 'No sessions scheduled yet',
    message: 'Book your first session.',
    illustration: UiStateAssets.noSessions,
    primaryActionLabel: 'Find a therapist',
    showArrow: true,
  },
  therapists: {
    title: 'No therapists found',
    illustration: UiStateAssets.noTherapists,
  },
  searchResults: {
    title: 'No search results',
    illustration: UiStateAssets.noSearchResults,
    primaryActionLabel: 'Clear search',
  },
  notifications: {
    title: 'No notifications',
    illustration: UiStateAssets.noNotifications,
  },
  careCredits: {
    title: 'No care credits',
    illustration: UiStateAssets.noCareCredits,
  },
  moodHistory: {
    title: 'No mood history found',
    illustration: UiStateAssets.noMoodHistory,
    primaryActionLabel: 'Start Mood Tracking',
  },
  invoices: {
    title: 'No invoices',
    illustration: UiStateAssets.noInvoices,
  },
};

export const ERROR_VARIANTS: Record<ErrorVariant, StateVariantConfig> = {
  server: {
    title: "Oops! We're having trouble connecting to our servers.",
    illustration: UiStateAssets.serverError,
    primaryActionLabel: 'Try again',
  },
  generic: {
    title: 'Oops! Something went wrong.',
    illustration: UiStateAssets.genericError,
    primaryActionLabel: 'Try again',
  },
  sessionExpired: {
    title: 'Session Expired',
    message: 'Your session has expired. Please sign in again to continue.',
    illustration: UiStateAssets.sessionExpired,
    primaryActionLabel: 'Sign in',
  },
  booking: {
    title: 'Something went wrong while booking your session.',
    illustration: UiStateAssets.bookingFailed,
    primaryActionLabel: 'Try again',
  },
  payment: {
    title: 'Uh-oh your payment failed',
    illustration: UiStateAssets.paymentFailed,
    primaryActionLabel: 'Try again',
  },
};

export const OFFLINE_CONFIG: StateVariantConfig = {
  title: "Uh-oh you're not connected to the internet!",
  illustration: UiStateAssets.internetError,
  primaryActionLabel: 'Try again',
};

export const SUCCESS_VARIANTS: Record<SuccessVariant, StateVariantConfig> = {
  booking: {
    title: 'Confirmed Booking',
    illustration: UiStateAssets.bookingSuccess,
    primaryActionLabel: 'Go to schedule',
    showArrow: true,
  },
  payment: {
    title: 'Payment successful!',
    illustration: UiStateAssets.paymentSuccess,
    primaryActionLabel: 'Done',
  },
  moodSaved: {
    title: 'Mood Saved',
    illustration: UiStateAssets.moodSaved,
    primaryActionLabel: 'View mood history',
    showArrow: true,
  },
  passwordChanged: {
    title: 'Password changed!',
    message: 'Your password has been changed successfully.',
    titleAccent: true,
    primaryActionLabel: 'Done',
  },
  sessionCancelled: {
    title: 'Session cancelled!',
    message: 'Your appointment has been cancelled successfully.',
    titleAccent: true,
    primaryActionLabel: 'Done',
  },
};
