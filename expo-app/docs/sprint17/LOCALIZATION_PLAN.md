# LOCALIZATION_PLAN.md

**Sprint 17** — Hey Attrangi Expo frontend  
**Scope:** i18n architecture, Indian languages, RTL prep  
**Date:** 2026-07-15

## Executive summary

Localization is **frontend-only**: English is the source of truth; secondary locales ship partial catalogs with English fallback. Language preference persists via user preferences and syncs at bootstrap through `setI18nLocale`.

## Supported locales

| Code | Language | Catalog | Status |
|------|----------|---------|--------|
| `en` | English | Full | Source of truth |
| `hi` | Hindi | Partial + fallback | Active |
| `kn` | Kannada | Partial + fallback | Active |
| `te` | Telugu | Partial + fallback | Active |
| `ta` | Tamil | Partial + fallback | Active |
| `ml` | Malayalam | Partial + fallback | Active |
| `mr` | Marathi | Partial + fallback | Active |

Files: `src/i18n/locales/{en,hi,kn,te,ta,ml,mr}.ts`

## Architecture

```
t(key) → locale catalog → en fallback → key string
setI18nLocale(code) → memory + optional I18nManager RTL swap (future)
useI18n() → { t, locale, setLocale }
```

- **Do not hardcode** user-facing strings in new UI — use `t('…')`.
- Tab labels already use `t('tabs.*')` in `MainTabNavigator`.
- Language screen writes preference and remounts tabs via locale key.

## RTL preparation

- `RTL_LOCALES` set is currently **empty** (LTR Indian languages).
- When Arabic / Hebrew / Urdu arrive: add codes to `RTL_LOCALES`, call `I18nManager.allowRTL` / `forceRTL`, and remount root (`MainTabNavigator` already keys on locale).
- Prefer start/end spacing over left/right in new layout code.

## Adding a language

1. Copy `en.ts` → `xx.ts` and translate values.  
2. Register in `src/i18n/index.ts` catalogs map.  
3. Add option on Language / Appearance flow.  
4. Expand catalog coverage iteratively (nav + settings first).

## Coverage strategy

| Priority | Domains |
|----------|---------|
| P0 | Tabs, settings, common actions, errors |
| P1 | Home, booking, session chrome |
| P2 | Engagement / institution copy |
| P3 | Long-form education content |

## Testing

- Switch Language → Hindi → confirm tab labels + restart persistence.  
- Missing keys must fall back to English (never blank).  
- Extra Large + Hindi tab labels: no overflow on SE.

## Out of scope (this sprint)

- Backend locale negotiation  
- Per-locale assets / voice packs  
- Full copy completion for all screens  
