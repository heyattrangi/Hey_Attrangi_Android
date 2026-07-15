/**
 * Locale catalogs may omit keys (English fallback) and use any string values.
 * Do not use literal English string types for translated leaves.
 */
export type LocalePartial<T> = {
  [K in keyof T]?: T[K] extends string
    ? string
    : T[K] extends object
      ? LocalePartial<T[K]>
      : T[K];
};
