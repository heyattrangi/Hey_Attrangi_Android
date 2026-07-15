import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  LoadingState,
  ErrorState,
  OfflineState,
  SuccessState,
} from '../ui/states';
import { SkeletonChat } from '../async';
import { CompanionUiPhase } from '../../types/domain';
import { Spacing } from '../../app/design-system';

export interface CompanionStateHostProps {
  phase: CompanionUiPhase;
  errorMessage?: string | null;
  onRetry?: () => void;
  onStartFresh?: () => void;
  children: React.ReactNode;
}

/**
 * Maps companion UI phases to reusable Sprint 1 states.
 * Covers: loading, offline, error, conversation ended.
 * thinking / typing / voice / empty phases render inline via children.
 */
export const CompanionStateHost = memo<CompanionStateHostProps>(({
  phase,
  errorMessage,
  onRetry,
  onStartFresh,
  children,
}) => {
  if (phase === 'loading') {
    return (
      <View style={styles.fill}>
        <SkeletonChat />
        <LoadingState domain="chat" style={styles.loadingOverlay} />
      </View>
    );
  }

  if (phase === 'offline') {
    return (
      <View style={styles.fill}>
        <OfflineState onRetry={onRetry} />
      </View>
    );
  }

  if (phase === 'error') {
    return (
      <View style={styles.fill}>
        <ErrorState
          variant="generic"
          message={errorMessage ?? 'Something went wrong in this conversation.'}
          onRetry={onRetry}
        />
      </View>
    );
  }

  if (phase === 'ended') {
    return (
      <View style={styles.fill}>
        <SuccessState
          variant="moodSaved"
          title="Conversation ended"
          message="You can start a new conversation whenever you're ready."
          actionLabel="Start fresh"
          onAction={onStartFresh}
        />
      </View>
    );
  }

  return <>{children}</>;
});

CompanionStateHost.displayName = 'CompanionStateHost';

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  loadingOverlay: {
    marginTop: Spacing.md,
  },
});
