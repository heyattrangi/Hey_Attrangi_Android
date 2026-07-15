import { useCallback, useEffect, useRef, useState } from 'react';
import { RequestStatus } from '../types/api';
import { useUiStore } from '../store/uiStore';

interface UseAsyncActionOptions {
  successMessage?: string;
  errorMessage?: string;
  showToastOnError?: boolean;
  showToastOnSuccess?: boolean;
}

export const useAsyncAction = (options: UseAsyncActionOptions = {}) => {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const showToast = useUiStore((s) => s.showToast);
  const mountedRef = useRef(true);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const run = useCallback(
    async (action: () => Promise<void>) => {
      if (status === 'loading') return;
      setStatus('loading');
      try {
        await action();
        if (mountedRef.current) {
          setStatus('success');
        }
        if (options.showToastOnSuccess && options.successMessage) {
          showToast(options.successMessage);
        }
      } catch {
        if (mountedRef.current) {
          setStatus('error');
        }
        if (options.showToastOnError !== false) {
          showToast(options.errorMessage ?? 'Something went wrong', 'error');
        }
        throw new Error('async-action-failed');
      } finally {
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
        }
        resetTimerRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setStatus('idle');
          }
          resetTimerRef.current = null;
        }, 400);
      }
    },
    [options, showToast, status],
  );

  return {
    status,
    isLoading: status === 'loading',
    run,
  };
};
