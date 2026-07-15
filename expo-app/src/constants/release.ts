/**
 * Release Candidate version surface — keep aligned with:
 * - app.json `expo.version` / ios.buildNumber / android.versionCode
 * - package.json `version`
 * - appMeta.APP_VERSION / APP_BUILD
 */
export const RELEASE = {
  versionName: '1.0.0',
  versionCode: 1,
  iosBuildNumber: '1',
  channel:
    (typeof process !== 'undefined' &&
      process.env?.EXPO_PUBLIC_RELEASE_CHANNEL) ||
    'rc',
  codename: 'Calm Companion',
  /** Internal testing vs public store */
  status: 'release_candidate' as const,
} as const;

export type ReleaseStatus = typeof RELEASE.status;
