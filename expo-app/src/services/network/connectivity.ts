import { AppState, AppStateStatus } from 'react-native';
import { logger } from '../../utils/logger';

export interface ConnectivitySnapshot {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}

type Listener = (snap: ConnectivitySnapshot) => void;

/**
 * Connectivity listener without a hard NetInfo dependency (Expo Go safe).
 * Tries dynamic NetInfo when available; otherwise assumes online and
 * refreshes on AppState resume. Forced offline is handled by networkStore.
 */
export function startConnectivityListener(onChange: Listener): () => void {
  let stopped = false;
  let unsubscribeNetInfo: (() => void) | undefined;

  const emitOnline = () => {
    if (!stopped) {
      onChange({ isConnected: true, isInternetReachable: true });
    }
  };

  try {
    // Optional peer — present in custom/dev builds, absent in bare Expo Go.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const NetInfo = require('@react-native-community/netinfo');
    if (NetInfo?.addEventListener) {
      unsubscribeNetInfo = NetInfo.addEventListener(
        (state: {
          isConnected: boolean | null;
          isInternetReachable: boolean | null;
        }) => {
          if (stopped) return;
          onChange({
            isConnected: Boolean(state.isConnected),
            isInternetReachable: state.isInternetReachable,
          });
        },
      );
      void NetInfo.fetch?.().then(
        (state: {
          isConnected: boolean | null;
          isInternetReachable: boolean | null;
        }) => {
          if (stopped) return;
          onChange({
            isConnected: Boolean(state.isConnected),
            isInternetReachable: state.isInternetReachable,
          });
        },
      );
      logger.debug('[connectivity] Using NetInfo');
    } else {
      emitOnline();
    }
  } catch {
    logger.debug('[connectivity] NetInfo unavailable — assuming online');
    emitOnline();
  }

  const onAppState = (next: AppStateStatus) => {
    if (next === 'active' && !unsubscribeNetInfo) {
      emitOnline();
    }
  };
  const appSub = AppState.addEventListener('change', onAppState);

  return () => {
    stopped = true;
    unsubscribeNetInfo?.();
    appSub.remove();
  };
}
