/** Default TTLs — tune per domain when wiring real APIs */
export const CachePolicy = {
  therapistsList: 60_000,
  therapistDetail: 120_000,
  profile: 30_000,
  moodHistory: 20_000,
  sessions: 15_000,
  notifications: 10_000,
  short: 5_000,
  none: 0,
} as const;

export type CachePolicyKey = keyof typeof CachePolicy;
