import { ImageSourcePropType } from 'react-native';
import { RequestStatus } from '../../types/api';
import { AppError } from '../../types/errors';

/** Domain empty states — maps to Design-folder empty PNGs */
export type EmptyKind =
  | 'chatHistory'
  | 'sessions'
  | 'therapists'
  | 'notifications'
  | 'careCredits'
  | 'moodHistory'
  | 'invoices'
  | 'searchResults';

/** Loading illustration domain — maps to Design-folder *loading*.png */
export type LoadingDomain =
  | 'home'
  | 'chat'
  | 'therapist'
  | 'session'
  | 'profile'
  | 'invoice'
  | 'default';

export type UiStateKey =
  | 'loading'
  | 'skeleton'
  | 'shimmer'
  | 'error.internet'
  | 'error.server'
  | 'error.generic'
  | 'error.sessionExpired'
  | 'empty.chatHistory'
  | 'empty.sessions'
  | 'empty.therapists'
  | 'empty.notifications'
  | 'empty.careCredits'
  | 'empty.moodHistory'
  | 'empty.invoices'
  | 'empty.searchResults'
  | 'success.booking'
  | 'failure.booking'
  | 'success.payment'
  | 'failure.payment'
  | 'success.moodSaved'
  | 'success.passwordChanged'
  | 'success.sessionCancelled'
  | 'dialog.logout'
  | 'dialog.discardChanges'
  | 'dialog.cancelSession'
  | 'dialog.deleteAccount'
  | 'dialog.permissionRequired'
  | 'dialog.biometricSetup'
  | 'dialog.sessionExpired'
  | 'content';

export type UiStatePresentation =
  | 'fullscreen'
  | 'inline'
  | 'dialog'
  | 'skeleton'
  | 'shimmer';

export interface UiStateDefinition {
  key: UiStateKey;
  title: string;
  message?: string;
  illustration?: ImageSourcePropType;
  presentation: UiStatePresentation;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showArrow?: boolean;
}

export interface ResolveUiStateInput {
  status: RequestStatus;
  error?: AppError | null;
  emptyKind?: EmptyKind;
  loadingDomain?: LoadingDomain;
  /** True when empty result is from an active search query */
  searchActive?: boolean;
  hasCachedData?: boolean;
  /** Prefer skeleton over illustration loading */
  preferSkeleton?: boolean;
}

export interface UiStateActions {
  onRetry?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onDismiss?: () => void;
}
