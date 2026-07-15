import { InteractionManager } from 'react-native';

/**
 * Performance helpers — FlatList virtualization, deferred work, image guidance.
 * Prefer `OptimizedFlatList` and `AppImage` (expo-image cache) in feature code.
 */
export const Performance = {
  afterInteractions(task: () => void): { cancel: () => void } {
    const handle = InteractionManager.runAfterInteractions(task);
    return { cancel: () => handle.cancel() };
  },

  listDefaults: {
    initialNumToRender: 8,
    maxToRenderPerBatch: 8,
    windowSize: 7,
    removeClippedSubviews: true,
    keyExtractor: (item: { id: string }) => item.id,
  } as const,

  /**
   * FlashList is recommended when shipping a custom binary:
   * `npx expo install @shopify/flash-list`
   * Keep OptimizedFlatList until then (Expo Go safe).
   */
  flashListReady: false,

  startup: {
    /** Keep splash short; fonts already gated in App.tsx */
    minSplashMs: 200,
    deferNonCriticalMs: 400,
  },

  checklist: [
    'images',
    'flatlists',
    'navigation',
    'memoization',
    'bundle',
    'assets',
    'fonts',
    'icons',
  ] as const,
};
