import React, { memo } from 'react';
import { getUiStateDefinition } from '../../app/ui-states';
import { DesignStateView } from './DesignStateView';
import { BookingSuccessView, BookingSuccessDetails } from './BookingSuccessView';
import { LoadingIllustration } from './LoadingIllustration';
import { Skeleton, Shimmer } from '../ui';
import { LoadingDomain } from '../../app/ui-states';

/** Named Design-folder states — use for explicit screens / navigation results */

export const InternetErrorState = memo<{ onRetry?: () => void }>(({ onRetry }) => (
  <DesignStateView
    definition={getUiStateDefinition('error.internet')}
    onPrimaryAction={onRetry}
  />
));
InternetErrorState.displayName = 'InternetErrorState';

export const ServerErrorState = memo<{ onRetry?: () => void }>(({ onRetry }) => (
  <DesignStateView
    definition={getUiStateDefinition('error.server')}
    onPrimaryAction={onRetry}
  />
));
ServerErrorState.displayName = 'ServerErrorState';

export const GenericErrorState = memo<{ onRetry?: () => void }>(({ onRetry }) => (
  <DesignStateView
    definition={getUiStateDefinition('error.generic')}
    onPrimaryAction={onRetry}
  />
));
GenericErrorState.displayName = 'GenericErrorState';

export const SessionExpiredState = memo<{ onSignIn?: () => void }>(({ onSignIn }) => (
  <DesignStateView
    definition={getUiStateDefinition('error.sessionExpired')}
    onPrimaryAction={onSignIn}
  />
));
SessionExpiredState.displayName = 'SessionExpiredState';

export const NoChatHistoryState = memo<{ onStartChat?: () => void }>(({ onStartChat }) => (
  <DesignStateView
    definition={getUiStateDefinition('empty.chatHistory')}
    onPrimaryAction={onStartChat}
  />
));
NoChatHistoryState.displayName = 'NoChatHistoryState';

export const NoSessionsState = memo<{ onFindTherapist?: () => void }>(({ onFindTherapist }) => (
  <DesignStateView
    definition={getUiStateDefinition('empty.sessions')}
    onPrimaryAction={onFindTherapist}
  />
));
NoSessionsState.displayName = 'NoSessionsState';

export const NoTherapistsState = memo(() => (
  <DesignStateView definition={getUiStateDefinition('empty.therapists')} />
));
NoTherapistsState.displayName = 'NoTherapistsState';

export const NoSearchResultsState = memo<{ onClear?: () => void }>(({ onClear }) => (
  <DesignStateView
    definition={getUiStateDefinition('empty.searchResults')}
    onPrimaryAction={onClear}
  />
));
NoSearchResultsState.displayName = 'NoSearchResultsState';

export const NoNotificationsState = memo(() => (
  <DesignStateView definition={getUiStateDefinition('empty.notifications')} />
));
NoNotificationsState.displayName = 'NoNotificationsState';

export const NoUnreadNotificationsState = memo<{ onShowAll?: () => void }>(
  ({ onShowAll }) => (
    <DesignStateView
      definition={{
        ...getUiStateDefinition('empty.notifications'),
        title: 'No unread notifications',
        message: "You're all caught up. New updates will appear here.",
        primaryActionLabel: onShowAll ? 'Show all' : undefined,
      }}
      onPrimaryAction={onShowAll}
    />
  ),
);
NoUnreadNotificationsState.displayName = 'NoUnreadNotificationsState';

export const NoCareCreditsState = memo(() => (
  <DesignStateView definition={getUiStateDefinition('empty.careCredits')} />
));
NoCareCreditsState.displayName = 'NoCareCreditsState';

export const NoMoodHistoryState = memo<{ onStartTracking?: () => void }>(({ onStartTracking }) => (
  <DesignStateView
    definition={getUiStateDefinition('empty.moodHistory')}
    onPrimaryAction={onStartTracking}
  />
));
NoMoodHistoryState.displayName = 'NoMoodHistoryState';

export const NoInvoicesState = memo(() => (
  <DesignStateView definition={getUiStateDefinition('empty.invoices')} />
));
NoInvoicesState.displayName = 'NoInvoicesState';

export const BookingFailedState = memo<{ onRetry?: () => void }>(({ onRetry }) => (
  <DesignStateView
    definition={getUiStateDefinition('failure.booking')}
    onPrimaryAction={onRetry}
  />
));
BookingFailedState.displayName = 'BookingFailedState';

export const PaymentSuccessState = memo<{ onDone?: () => void }>(({ onDone }) => (
  <DesignStateView
    definition={getUiStateDefinition('success.payment')}
    onPrimaryAction={onDone}
  />
));
PaymentSuccessState.displayName = 'PaymentSuccessState';

export const PaymentFailedState = memo<{ onRetry?: () => void }>(({ onRetry }) => (
  <DesignStateView
    definition={getUiStateDefinition('failure.payment')}
    onPrimaryAction={onRetry}
  />
));
PaymentFailedState.displayName = 'PaymentFailedState';

export const MoodSavedState = memo<{ onViewHistory?: () => void }>(({ onViewHistory }) => (
  <DesignStateView
    definition={getUiStateDefinition('success.moodSaved')}
    onPrimaryAction={onViewHistory}
  />
));
MoodSavedState.displayName = 'MoodSavedState';

export const LoadingStateView = memo<{ domain?: LoadingDomain }>(({ domain }) => (
  <LoadingIllustration domain={domain} />
));
LoadingStateView.displayName = 'LoadingStateView';

export const SkeletonStateView = memo(() => <Skeleton variant="list" count={3} />);
SkeletonStateView.displayName = 'SkeletonStateView';

export const ShimmerStateView = memo(() => <Shimmer height={120} />);
ShimmerStateView.displayName = 'ShimmerStateView';

export { BookingSuccessView };
export type { BookingSuccessDetails };
