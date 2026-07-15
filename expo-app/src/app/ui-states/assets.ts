import { ImageSourcePropType } from 'react-native';

/**
 * Design-folder PNG illustrations (cropped from Figma exports).
 */
export const UiStateAssets = {
  internetError: require('../../assets/ui-states/illustrations/internet-error.png'),
  serverError: require('../../assets/ui-states/illustrations/server-error.png'),
  genericError: require('../../assets/ui-states/illustrations/generic-error.png'),
  noChatHistory: require('../../assets/ui-states/illustrations/no-chat-history.png'),
  noTherapists: require('../../assets/ui-states/illustrations/no-therapists.png'),
  noSearchResults: require('../../assets/ui-states/illustrations/no-search-results.png'),
  noNotifications: require('../../assets/ui-states/illustrations/no-notifications.png'),
  noCareCredits: require('../../assets/ui-states/illustrations/no-care-credits.png'),
  noMoodHistory: require('../../assets/ui-states/illustrations/no-mood-history.png'),
  noInvoices: require('../../assets/ui-states/illustrations/no-invoices.png'),
  noSessions: require('../../assets/ui-states/illustrations/no-sessions.png'),
  bookingSuccess: require('../../assets/ui-states/illustrations/booking-success.png'),
  bookingFailed: require('../../assets/ui-states/illustrations/booking-failed.png'),
  paymentSuccess: require('../../assets/ui-states/illustrations/payment-success.png'),
  paymentFailed: require('../../assets/ui-states/illustrations/payment-failed.png'),
  moodSaved: require('../../assets/ui-states/illustrations/mood-saved.png'),
  passwordChanged: require('../../assets/ui-states/illustrations/password-changed.png'),
  sessionExpired: require('../../assets/ui-states/illustrations/session-expired.png'),
  sessionCancelled: require('../../assets/ui-states/illustrations/session-cancelled.png'),
  logoutDialog: require('../../assets/ui-states/illustrations/logout-dialog.png'),
  discardChanges: require('../../assets/ui-states/illustrations/discard-changes.png'),
  cancelSession: require('../../assets/ui-states/illustrations/cancel-session.png'),
  loadingHome: require('../../assets/ui-states/illustrations/loading-home.png'),
  loadingChat: require('../../assets/ui-states/illustrations/loading-chat.png'),
  loadingTherapist: require('../../assets/ui-states/illustrations/loading-therapist.png'),
  loadingSession: require('../../assets/ui-states/illustrations/loading-session.png'),
  loadingProfile: require('../../assets/ui-states/illustrations/loading-profile.png'),
  loadingInvoice: require('../../assets/ui-states/illustrations/loading-invoice.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type UiStateAssetKey = keyof typeof UiStateAssets;
