/**
 * Shared FlatList tuning — keep scroll jank low across feature lists.
 */
export const LIST_PERF = {
  /** Chat / dense reverse lists */
  chat: {
    windowSize: 8,
    initialNumToRender: 12,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    removeClippedSubviews: true,
  },
  /** Cards (therapists, sessions, journal) */
  cards: {
    windowSize: 7,
    initialNumToRender: 8,
    maxToRenderPerBatch: 6,
    updateCellsBatchingPeriod: 50,
    removeClippedSubviews: true,
  },
  /** Simple rows (settings search, devices) */
  rows: {
    windowSize: 10,
    initialNumToRender: 14,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 40,
    removeClippedSubviews: true,
  },
} as const;

export const keyExtractorId = <T extends { id: string }>(item: T) => item.id;
