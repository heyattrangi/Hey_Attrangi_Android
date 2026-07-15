import React, { memo } from 'react';
import { EmptyState } from '../ui/states';

export const NoUpcomingSessionsState = memo<{ onFindTherapist?: () => void }>(
  ({ onFindTherapist }) => (
    <EmptyState
      variant="sessions"
      title="No upcoming sessions"
      message="Book a session when you feel ready for support."
      actionLabel="Find a therapist"
      onAction={onFindTherapist}
    />
  ),
);
NoUpcomingSessionsState.displayName = 'NoUpcomingSessionsState';

export const TherapistDelayedState = memo<{ onWait?: () => void }>(({ onWait }) => (
  <EmptyState
    variant="sessions"
    title="Therapist delayed"
    message="Your therapist is running a little late. Hang tight in the waiting room."
    actionLabel="Keep waiting"
    onAction={onWait}
  />
));
TherapistDelayedState.displayName = 'TherapistDelayedState';

export const TherapistCancelledState = memo<{ onReschedule?: () => void }>(
  ({ onReschedule }) => (
    <EmptyState
      variant="sessions"
      title="Session cancelled"
      message="This session was cancelled by your therapist. You can reschedule anytime."
      actionLabel="Book again"
      onAction={onReschedule}
    />
  ),
);
TherapistCancelledState.displayName = 'TherapistCancelledState';

export const ConnectionFailedState = memo<{ onRetry?: () => void }>(({ onRetry }) => (
  <EmptyState
    variant="sessions"
    title="Connection failed"
    message="We could not connect to the session room. Check your network and try again."
    actionLabel="Retry"
    onAction={onRetry}
  />
));
ConnectionFailedState.displayName = 'ConnectionFailedState';

export const SessionEndedState = memo<{ onHome?: () => void }>(({ onHome }) => (
  <EmptyState
    variant="sessions"
    title="Session ended"
    message="This therapy session has ended. Take a breath — you showed up for yourself."
    actionLabel="Back home"
    onAction={onHome}
  />
));
SessionEndedState.displayName = 'SessionEndedState';
