import { logger } from '../../utils/logger';
import { useAppConfigStore } from '../../store/appConfigStore';
import { toAppError } from '../../types/errors';

/**
 * Crash reporting placeholder — wire Sentry / Crashlytics later.
 */
class CrashReportingImpl {
  private enabled(): boolean {
    return useAppConfigStore.getState().isFlagEnabled('enableCrashReporting');
  }

  init(): void {
    logger.debug('[crash] init placeholder');
  }

  captureException(error: unknown, context?: Record<string, unknown>): void {
    const appError = toAppError(error);
    if (!this.enabled()) {
      logger.error('[crash:stub]', appError.code, appError.message, context);
      return;
    }
    // Future: Sentry.captureException(error, { extra: context })
    logger.error('[crash]', appError.code, appError.message, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.enabled()) {
      logger.debug('[crash:stub:message]', level, message);
      return;
    }
    logger.info('[crash:message]', level, message);
  }

  setUser(_userId: string | null): void {
    // Future: Sentry.setUser
  }
}

export const crashReporting = new CrashReportingImpl();
