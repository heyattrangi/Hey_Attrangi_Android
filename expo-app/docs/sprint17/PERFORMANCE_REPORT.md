# PERFORMANCE_REPORT.md

**Sprint 17** — Hey Attrangi Expo frontend  
**Scope:** Production performance architecture (no backend)  
**Date:** 2026-07-15

## Executive summary

Performance work focused on **reusable primitives** and **defaults**, not feature UI rewrites. The app already uses Reanimated, memoized cards, and design-system Motion tokens. Sprint 17 adds caching images, optimized lists, deferred bootstrap work, and standardized motion/battery-aware timers.

## Optimizations delivered

| Area | Change | Path |
|------|--------|------|
| Images | `expo-image` with memory-disk cache, fade-in, blurhash placeholder, error fallback, aspect locks | `src/components/app/AppImage.tsx` |
| Lists | `OptimizedFlatList` (windowing, batching, Android `removeClippedSubviews`) | `src/components/layout/OptimizedFlatList.tsx` |
| FlashList | Prepared — install `@shopify/flash-list` for custom binaries; Expo Go uses FlatList | `src/platform/Performance.ts` |
| Startup | Font gate + short splash; defer non-critical work via `InteractionManager` | `App.tsx`, `AppBootstrap.tsx` |
| Motion | Standardized presets; collapse durations when Reduce Motion is on | `Motion.ts`, `useReducedMotion`, `useStandardMotion` |
| Battery | `usePausableInterval` stops timers in background / reduce-motion | `src/hooks/useBatteryAware.ts` |
| Memory | Dispose network listener + deferred task on bootstrap unmount | `AppBootstrap.tsx` |
| Icons/Fonts | Existing vector icons + Plus Jakarta load path retained | `App.tsx` |

## Audit findings (pre-existing)

- Many product lists already use horizontal `ScrollView` for short rails (acceptable).
- Long vertical feeds should migrate to `OptimizedFlatList`.
- Some screens still use RN `Image` (Waiting Room, video placeholders) — migrate to `AppImage` when touching those files.
- No React Query; Zustand stores are domain-split (Sprint 16 audit).

## Bundle notes

- Added dependency: `expo-image` (Expo SDK 57 aligned).
- FlashList **not** added — keeps Expo Go compatibility; flagged in `Performance.flashListReady`.

## Recommendations (next)

1. Replace remaining raw `<Image>` with `AppImage`.
2. Adopt `OptimizedFlatList` on Notification Center, Search results, Billing history.
3. Profile with Flipper / React DevTools in release builds on mid-tier Android.
4. Consider `expo-font` subsetting if more faces are added.

## QA checklist

- [x] Startup still reaches Home under mock services  
- [x] Avatar / AppImage typecheck clean  
- [x] Reduce Motion zeroes decorative durations via hooks  
- [ ] Instruments / Android Profiler pass on matrix devices (manual)  
