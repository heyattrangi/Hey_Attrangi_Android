# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo currently tracks a single product surface:

- **`expo-app/`** — the Hey Attrangi mobile app (React Native / Expo, TypeScript). This is where nearly all work happens. It's a **frontend-only, mock-first app**: it ships with a complete mock backend so it runs standalone with no server, and is designed to swap to real APIs later with minimal changes (see Architecture below).
- **`app-heyattrangi/`** — a Next.js web project that also lives on disk here but is **its own separate git repository** (has its own `.git`, shown as untracked in this repo's `git status`). Do not assume commands/config from the root `.gitignore` or this CLAUDE.md apply to it; `cd` into it and treat it independently if asked to work there.

All commands below assume `cd expo-app` first unless noted.

## Commands

```bash
cd expo-app
npm install

npm start              # Expo Go via helper script (auto-detects LAN IP, sets EXPO_OFFLINE=1)
npm run start:tunnel   # Expo Go over a tunnel (works across networks/firewalls)
npm run start:lan      # Expo Go over LAN, offline-cached
npm run android        # Expo Go, Android
npm run ios            # Expo Go, iOS (EXPO_OFFLINE=1)
npm run web            # Expo web

npm run typecheck      # tsc --noEmit — the only automated check in this project (no lint/test scripts)
```

There is no test runner or linter configured in `expo-app` — `npm run typecheck` is the correctness gate to run after changes.

Node version is pinned via `.nvmrc`; `scripts/start-expo-go.sh` tries `nvm use` for it automatically before starting Metro.

### Release builds (EAS)

```bash
eas build --profile preview --platform android   # internal / QA, mock APIs on
eas build --profile beta --platform all           # closed beta, mock APIs off
eas build --profile production --platform all     # public release, mock APIs off
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

Full profile matrix and version-bump checklist: `expo-app/docs/sprint25/BUILD_AND_RELEASE.md`.

## Architecture (expo-app)

### Layering: Store → Service → Repository → HttpClient

Every feature domain (auth, mood, therapists, booking, sessions, chat, journal, wellness, billing, video, search, personalization, engagement, institution, reports, family, community, portal, devtools) follows the same four-layer pattern:

1. **`src/store/*Store.ts`** — Zustand stores. Screens/components read state and call store actions; they never call services directly.
2. **`src/services/<domain>/I<Domain>Service.ts`** — an interface, with **`Mock<Domain>Service`** and **`Real<Domain>Service`** implementations side by side in the same folder.
3. **`src/repositories/<Domain>Repository.ts`** — used by the *Real* service to talk to the `HttpClient`.
4. **`src/network/`** — `HttpClient` abstraction with two backends: `MockHttpAdapter` (in-memory, route-registered) or `FetchHttpClient` (real network), chosen automatically based on `env.API_BASE_URL`.

**`src/services/container.ts`** is the single DI point: every domain exposes a `get<Domain>Service()` that picks Mock vs Real based on `shouldUseMockServices()` / `shouldUseMockNonAuth()`. Auth mocking and non-auth-module mocking can be toggled independently (see `src/config/devRuntime.ts` — supports runtime overrides from Dev Tools, layered over the build-time `env` flags).

**To swap mocks for a real backend later:** set `env.USE_MOCK_SERVICES = false` and point `env.API_BASE_URL` at a real host — no store or screen changes are required. This is the intended migration path baked into the architecture; preserve it when adding new domains (always add a matching `Mock*`/`Real*` pair behind the same interface, never call a mock or repository directly from a store).

`src/network/registerMockRoutes.ts` maps REST-shaped routes (`/auth/login`, `/auth/refresh`, etc.) onto the existing `Mock*Service` methods, so the mock network layer and the mock service layer stay consistent with each other.

### Environment / config

- `src/config/env.ts` resolves `AppEnvironment` (`mock | development | staging | production`) from `EXPO_PUBLIC_APP_ENV`, defaulting to `mock` in `__DEV__`. Each environment has its own config block (API base URL, timeouts, store URLs, etc.).
- `EXPO_PUBLIC_USE_MOCK=false` is how mock services get disabled for beta/production builds.
- `src/config/featureFlags.ts` holds `DEFAULT_FEATURE_FLAGS`; read via `useFeatureFlag` hook, not directly from `env.featureFlags` (deprecated re-export kept for compatibility).
- `src/config/devRuntime.ts` provides in-app runtime overrides for the mock/env switches, driven by `devToolsStore` (Dev Tools screen) — this lets the app flip mock↔real without a rebuild during development.

### Navigation and app shell

- `App.tsx` boots fonts, splash screen, then wraps everything in `ErrorBoundary → MaintenanceGate → AppBootstrap → RootNavigator` plus global overlay components (toast, snackbar, network banner, global loader/error host, update prompt).
- `src/navigation/RootNavigator.tsx` switches between `AuthNavigator`, `OnboardingNavigator`, and `MainAppNavigator` purely based on `authStore` state (`isAuthenticated`, `hasCompletedOnboarding`) — there's no separate route-guard layer beyond this.
- Deep linking: scheme `heyattrangi://`, configured in `src/navigation/linking.ts` / `env.DEEP_LINK_PREFIXES`.

### Other structural notes

- `src/theme/` is the single source for colors, spacing, radius, typography, gradients, shadows — prefer these tokens over hardcoded style values.
- `src/i18n/` supports `en, hi, kn, ml, mr, ta, te` locales.
- `src/mocks/mock*.ts` hold the actual canned data consumed by `Mock*Service` implementations; `src/data/` holds DTOs/models/mappers shared between mock and real paths.
- `src/platform/` contains cross-cutting singletons (NetworkManager, SessionManagerFacade, ErrorManager, PermissionManager, SecurityManager, OfflineCache, Performance) wired up during `AppBootstrap`.
- Demo/mock auth accepts any email/phone + password, any 6-digit OTP, and a mock Google Sign-In token (no native Google SDK under Expo Go).

## Docs

`expo-app/docs/README.md` is the docs index — sprint-numbered folders hold historical architecture write-ups; `docs/sprint25/` is the current release-candidate sprint (build/release, regression/a11y/perf checklists, release notes). Check there before assuming an area is undocumented.
