import { useCallback, useMemo } from 'react';
import { I18nManager } from 'react-native';
import { usePreferencesStore } from '../store/preferencesStore';
import {
  getI18nLocale,
  isRtlLocale,
  setI18nLocale,
  t,
  TranslationKey,
  AppLocale,
  SUPPORTED_LOCALES,
} from './index';

/**
 * Bind preference language → i18n catalog.
 * RTL is prepared (isRTL) but I18nManager.forceRTL is not flipped at runtime
 * to avoid a full remount requirement until Arabic/Urdu ship.
 */
export function useI18n() {
  const languageCode = usePreferencesStore((s) => s.languageCode);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);

  const locale = useMemo(() => {
    const next = setI18nLocale(languageCode);
    return next;
  }, [languageCode]);

  const translate = useCallback(
    (key: TranslationKey | string, params?: Record<string, string | number>) => {
      // Ensure locale sync before read
      setI18nLocale(languageCode);
      return t(key, params);
    },
    [languageCode],
  );

  return {
    t: translate,
    locale: locale as AppLocale,
    languageCode,
    setLanguage: (code: string) => {
      setI18nLocale(code);
      setLanguage(code);
    },
    supported: SUPPORTED_LOCALES,
    isRTL: isRtlLocale(languageCode),
    /** Device RTL flag — do not force until RTL locales ship */
    systemRTL: I18nManager.isRTL,
    currentCatalogLocale: getI18nLocale(),
  };
}
