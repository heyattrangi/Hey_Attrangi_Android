import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View, Linking, Alert } from 'react-native';
import { Colors, Spacing, Typography, Radius } from '../../app/design-system';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { crashReporting } from '../../services/crash/CrashReporting';
import { logger } from '../../utils/logger';
import { analytics } from '../../services/analytics/AnalyticsService';
import { env } from '../../config/env';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Crash recovery UI — Retry / Restart / Report / Support.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || 'Unexpected error',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('[ErrorBoundary]', error, info.componentStack);
    crashReporting.captureException(error, {
      componentStack: info.componentStack ?? undefined,
    });
    analytics.track('crash_recovered', { phase: 'shown' });
  }

  private handleReset = () => {
    analytics.track('crash_recovered', { phase: 'retry' });
    this.setState({ hasError: false, message: '' });
  };

  private handleRestart = async () => {
    analytics.track('crash_recovered', { phase: 'restart' });
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const UpdatesMod = require('expo-updates');
      if (UpdatesMod?.reloadAsync) {
        await UpdatesMod.reloadAsync();
        return;
      }
    } catch {
      // fall through
    }
    this.handleReset();
  };

  private handleReport = () => {
    analytics.track('crash_recovered', { phase: 'report' });
    Alert.alert(
      'Report problem',
      'Thanks — a soft report was recorded locally. Crash Reporting SDK connects later.',
    );
    crashReporting.captureException(
      new Error(this.state.message || 'user_report'),
      { userReported: true },
    );
  };

  private handleSupport = () => {
    analytics.track('crash_recovered', { phase: 'support' });
    void Linking.openURL(
      `mailto:${env.SUPPORT_EMAIL}?subject=App%20crash%20report`,
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={styles.container}
          accessibilityRole="alert"
          accessibilityLabel="Something went wrong"
        >
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </Text>
          <Text style={styles.message} maxFontSizeMultiplier={1.4}>
            We hit an unexpected issue. Your data is safe — try again, restart,
            or reach support.
          </Text>
          {__DEV__ && this.state.message ? (
            <Text style={styles.dev}>{this.state.message}</Text>
          ) : null}
          <PrimaryButton label="Retry" onPress={this.handleReset} />
          <SecondaryButton label="Restart app" onPress={this.handleRestart} />
          <SecondaryButton label="Report problem" onPress={this.handleReport} />
          <SecondaryButton
            label="Contact support"
            onPress={this.handleSupport}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  dev: {
    ...Typography.caption,
    color: Colors.error,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.large,
    marginBottom: Spacing.sm,
  },
});
