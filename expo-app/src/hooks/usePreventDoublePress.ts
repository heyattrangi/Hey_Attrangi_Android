import { useCallback, useEffect, useRef } from 'react';

/** Prevents rapid duplicate presses (navigation, submit, etc.). */
export const usePreventDoublePress = (cooldownMs = 600) => {
  const locked = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  return useCallback(
    <T extends (...args: Parameters<T>) => void>(fn: T) =>
      (...args: Parameters<T>) => {
        if (locked.current) return;
        locked.current = true;
        fn(...args);
        if (unlockTimerRef.current) {
          clearTimeout(unlockTimerRef.current);
        }
        unlockTimerRef.current = setTimeout(() => {
          locked.current = false;
          unlockTimerRef.current = null;
        }, cooldownMs);
      },
    [cooldownMs],
  );
};
