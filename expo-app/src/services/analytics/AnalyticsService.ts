import { logger } from '../../utils/logger';
import { useAppConfigStore } from '../../store/appConfigStore';

/**
 * Analytics placeholder — wire Segment / Firebase / Amplitude later.
 * No PII should be logged here in production implementations.
 */
export type AnalyticsEventName =
  | 'app_open'
  | 'screen_view'
  | 'button_click'
  | 'auth_sign_in'
  | 'auth_sign_out'
  | 'session_booked'
  | 'session_joined'
  | 'mood_logged'
  | 'mood_event'
  | 'journal_saved'
  | 'journal_event'
  | 'therapy_event'
  | 'companion_message_sent'
  | 'conversation_event'
  | 'search_performed'
  | 'feature_flag_evaluated'
  | 'offline_queue_flushed'
  | 'permission_decision'
  | 'role_switched'
  | 'error_shown'
  | 'crash_recovered'
  | 'app_update_prompted';

export interface AnalyticsProps {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsServiceImpl {
  private enabled(): boolean {
    return useAppConfigStore.getState().isFlagEnabled('enableAnalytics');
  }

  track(event: AnalyticsEventName, props?: AnalyticsProps): void {
    if (!this.enabled()) {
      logger.debug('[analytics:stub]', event, props);
      return;
    }
    // Future: provider.track(event, props)
    logger.info('[analytics]', event, props);
  }

  screen(screenName: string, props?: AnalyticsProps): void {
    this.track('screen_view', { screen: screenName, ...props });
  }

  click(buttonId: string, props?: AnalyticsProps): void {
    this.track('button_click', { button_id: buttonId, ...props });
  }

  mood(event: string, props?: AnalyticsProps): void {
    this.track('mood_event', { event, ...props });
  }

  journal(event: string, props?: AnalyticsProps): void {
    this.track('journal_event', { event, ...props });
  }

  therapy(event: string, props?: AnalyticsProps): void {
    this.track('therapy_event', { event, ...props });
  }

  conversation(event: string, props?: AnalyticsProps): void {
    this.track('conversation_event', { event, ...props });
  }

  identify(_userId: string, _traits?: AnalyticsProps): void {
    if (!this.enabled()) return;
    // Future: provider.identify(userId, traits)
  }

  reset(): void {
    if (!this.enabled()) return;
    // Future: provider.reset()
  }
}

export const analytics = new AnalyticsServiceImpl();
