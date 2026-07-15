import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useReducedMotion } from './useReducedMotion';
import { Motion } from '../app/design-system';
import { logger } from '../utils/logger';

/**
 * Battery / memory conscious timer — pauses when app backgrounds
 * and skips intervals when reduce-motion is preferred.
 */
export function usePausableInterval(
  callback: () => void,
  delayMs: number | null,
  options?: { ignoreReduceMotion?: boolean },
): void {
  const reduce = useReducedMotion();
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (delayMs == null) return;
    if (reduce && !options?.ignoreReduceMotion) return;

    let id: ReturnType<typeof setInterval> | null = null;
    let appState: AppStateStatus = AppState.currentState;

    const start = () => {
      if (id) return;
      id = setInterval(() => saved.current(), delayMs);
    };
    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };

    if (appState === 'active') start();

    const sub = AppState.addEventListener('change', (next) => {
      appState = next;
      if (next === 'active') start();
      else stop();
    });

    return () => {
      stop();
      sub.remove();
    };
  }, [delayMs, reduce, options?.ignoreReduceMotion]);
}

/**
 * Standardized enter duration for Reanimated / Moti-style APIs.
 */
export function useStandardMotion() {
  const reduce = useReducedMotion();
  return {
    reduceMotion: reduce,
    duration: {
      fast: reduce ? 0 : Motion.duration.fast,
      normal: reduce ? 0 : Motion.duration.normal,
      slow: reduce ? 0 : Motion.duration.slow,
    },
    /** Prefer Pressable opacity; skip scale when reduce motion */
    pressScale: reduce ? 1 : Motion.scale.press,
    logDroppedFrameHint: () => {
      if (__DEV__) {
        logger.debug('[motion] Prefer Motion tokens; avoid >600ms loops on Home');
      }
    },
  };
}

/**
 * Register a cleanup for listeners/subscriptions — call on blur/unmount.
 */
export function useDisposableEffect(
  setup: () => (() => void) | void,
  deps: unknown[],
): void {
  useEffect(() => {
    const dispose = setup();
    return () => {
      dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
