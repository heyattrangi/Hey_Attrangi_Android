import { useCallback, useEffect, useRef } from 'react';
import { useIsMounted } from './useIsMounted';

/** Schedules timeouts that are cleared on unmount and skip callbacks after unmount. */
export const useSafeTimeout = () => {
  const mounted = useIsMounted();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const schedule = useCallback(
    (callback: () => void, delayMs: number) => {
      const timer = setTimeout(() => {
        if (mounted.current) {
          callback();
        }
      }, delayMs);
      timersRef.current.push(timer);
      return timer;
    },
    [mounted],
  );

  return schedule;
};
