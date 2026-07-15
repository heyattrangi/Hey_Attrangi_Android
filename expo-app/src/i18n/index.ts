import en, { TranslationTree } from './locales/en';
import hi from './locales/hi';
import kn from './locales/kn';
import te from './locales/te';
import ta from './locales/ta';
import ml from './locales/ml';
import mr from './locales/mr';

export type AppLocale =
  | 'en'
  | 'hi'
  | 'kn'
  | 'te'
  | 'ta'
  | 'ml'
  | 'mr';

export const SUPPORTED_LOCALES: AppLocale[] = [
  'en',
  'hi',
  'kn',
  'te',
  'ta',
  'ml',
  'mr',
];

/** Locales that will use RTL once Arabic/Urdu ship — prep flag only */
export const RTL_LOCALES: string[] = [];

import type { LocalePartial } from './locales/types';

const catalogs: Record<AppLocale, LocalePartial<TranslationTree>> = {
  en,
  hi,
  kn,
  te,
  ta,
  ml,
  mr,
};

type DotPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
      ? DotPaths<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

export type TranslationKey = DotPaths<TranslationTree>;

function getPath(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

let activeLocale: AppLocale = 'en';

export function setI18nLocale(code: string): AppLocale {
  const locale = (SUPPORTED_LOCALES.includes(code as AppLocale)
    ? code
    : 'en') as AppLocale;
  activeLocale = locale;
  return locale;
}

export function getI18nLocale(): AppLocale {
  return activeLocale;
}

export function isRtlLocale(code: string = activeLocale): boolean {
  return RTL_LOCALES.includes(code);
}

/**
 * Translate by dot-path key. Falls back to English, then the key itself.
 * Example: t('tabs.home') → 'Home'
 */
export function t(
  key: TranslationKey | string,
  params?: Record<string, string | number>,
): string {
  const fromActive = getPath(catalogs[activeLocale], key);
  const fromEn = getPath(en, key);
  let value = fromActive ?? fromEn ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
    });
  }
  return value;
}

export { en };
