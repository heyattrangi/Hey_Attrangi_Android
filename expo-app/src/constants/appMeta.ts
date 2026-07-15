/**
 * Version manager — display + compare helpers for update prompts.
 * Keep in sync with app.json / package.json / constants/release.ts.
 */
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '1';
export const APP_NAME = 'Hey Attrangi';
export { RELEASE } from './release';

/** Semver compare: -1 if a < b, 0 if equal, 1 if a > b */
export function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const av = pa[i] ?? 0;
    const bv = pb[i] ?? 0;
    if (av < bv) return -1;
    if (av > bv) return 1;
  }
  return 0;
}

export function isVersionBelow(current: string, minimum: string): boolean {
  return compareSemver(current, minimum) < 0;
}

export function isUpdateAvailable(current: string, latest: string): boolean {
  return compareSemver(current, latest) < 0;
}
