import { useCallback, useState } from 'react';

/**
 * Prepared pull-to-refresh hook for future backend integration.
 * Wire `onRefresh` to store fetch methods when APIs are connected.
 */
export const usePullToRefresh = (refreshAction: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refreshAction();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAction, refreshing]);

  return { refreshing, onRefresh };
};
