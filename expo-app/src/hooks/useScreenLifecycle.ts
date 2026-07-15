import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { AppState, AppStateStatus } from 'react-native';
import { analytics } from '../services/analytics/AnalyticsService';

export interface ScreenLifecycleOptions {
  /** Analytics / debug screen name */
  screenName?: string;
  /** Called when screen gains focus */
  onFocus?: () => void;
  /** Called when screen loses focus / exits */
  onBlur?: () => void;
  /** Called on focus and when app returns to foreground while focused */
  onRefresh?: () => void;
  /** Called when app becomes active while this screen is focused */
  onResume?: () => void;
  /** Track screen_view analytics */
  trackScreen?: boolean;
}

/**
 * Standardized screen lifecycle: focus, blur, refresh, resume, analytics.
 * State preservation remains the responsibility of Zustand/persisted stores.
 */
export function useScreenLifecycle(options: ScreenLifecycleOptions = {}): {
  isFocused: boolean;
  refresh: () => void;
} {
  const {
    screenName,
    onFocus,
    onBlur,
    onRefresh,
    onResume,
    trackScreen = Boolean(screenName),
  } = options;

  const isFocused = useIsFocused();
  const onRefreshRef = useRef(onRefresh);
  const onResumeRef = useRef(onResume);
  onRefreshRef.current = onRefresh;
  onResumeRef.current = onResume;

  const refresh = useCallback(() => {
    onRefreshRef.current?.();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (trackScreen && screenName) {
        analytics.screen(screenName);
      }
      onFocus?.();
      onRefreshRef.current?.();
      return () => {
        onBlur?.();
      };
    }, [onBlur, onFocus, screenName, trackScreen]),
  );

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next === 'active' && isFocused) {
        onResumeRef.current?.();
        onRefreshRef.current?.();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [isFocused]);

  return { isFocused, refresh };
}
