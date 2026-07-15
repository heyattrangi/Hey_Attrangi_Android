# Sprint 25 — Release Candidate (Version 1.0.0)

**Date:** 15 July 2026  
**Status:** Release Candidate — **Internal / Closed Beta** ready; public store blocked on legal + Design Video + final icons/screenshots.

---

## Deliverables checklist

| Item | Status | Location |
|------|--------|----------|
| App Icons | Wired (replace before public) | `assets/icon.png` |
| Splash Screen | Native + in-app | `app.json` splash · `SplashScreen.tsx` |
| Adaptive Icons | Wired | `assets/android-icon-*.png` |
| Store Screenshots | Folders ready | `store/ios`, `store/android` |
| Feature Graphics | Spec + folder | `store/android/feature-graphic/` |
| Privacy Policy | RC structure + URL CTA | HelpArticle `privacy` · `env.PRIVACY_POLICY_URL` |
| Terms | RC structure + URL CTA | HelpArticle `terms` · `env.TERMS_OF_SERVICE_URL` |
| Versioning | **1.0.0** / build `1` | `app.json` · `package.json` · `appMeta` · `release.ts` |
| Release Notes | Drafted | `CHANGELOG.md` · `docs/sprint25/RELEASE_NOTES_1.0.0.md` · store metadata |
| Production Build | Profiled | `eas.json` → `production` |
| Internal Testing | Profiled | `eas.json` → `preview` |
| Beta Build | Profiled | `eas.json` → `beta` |
| Regression Testing | Checklist | `REGRESSION_CHECKLIST.md` |
| Performance Testing | Checklist | `PERF_CHECKLIST.md` |
| Accessibility Testing | Checklist | `A11Y_CHECKLIST.md` |
| Documentation | Index + RC pack | `docs/README.md` · this folder |

---

## Version matrix

| Field | Value |
|-------|-------|
| Marketing version | `1.0.0` |
| iOS `buildNumber` | `1` |
| Android `versionCode` | `1` |
| `APP_BUILD` | `1` |
| Bundle / package | `com.heyaatrangi.expo` |
| Codename | Calm Companion |
| Channel default | `rc` |

---

## Gates before public 1.0.0

1. Counsel signs Privacy + Terms; host URLs live  
2. Final app icon / adaptive / splash art from Design  
3. Store screenshots (≥5) + Android feature graphic  
4. EAS `projectId` + Apple/Google credentials  
5. Video session Design No-Go resolved or feature-flagged off  
6. Pass regression + a11y + perf checklists on device matrix  
7. Set `EXPO_PUBLIC_USE_MOCK=false` for beta/production profiles (already in `eas.json`)

See `BUILD_AND_RELEASE.md` for commands.
