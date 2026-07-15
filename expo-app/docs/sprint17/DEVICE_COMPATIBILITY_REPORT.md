# DEVICE_COMPATIBILITY_REPORT.md

**Sprint 17** — Hey Attrangi Expo frontend  
**Scope:** Responsive layout + device matrix  
**Date:** 2026-07-15

## Executive summary

Layout resilience uses **safe areas**, **responsive content max-width**, and **font-scale-aware spacing** rather than device-specific forks. `useResponsiveLayout` / `ResponsiveContent` standardize padding and tablet centering.

## Responsive primitives

| Primitive | Role |
|-----------|------|
| `useResponsiveLayout` | Breakpoints: compact phone, large phone, tablet; orientation |
| `ResponsiveContent` | Horizontal pad + max content width on tablets |
| Safe Area | Existing `SafeAreaProvider` + screen wrappers |
| Dynamic Island / notches | Handled via safe-area insets (no fixed top offsets) |

## Target matrix

| Device / OS | Layout status | Notes |
|-------------|---------------|-------|
| Android 11+ | Supported | Material tabs; verify permission prompts |
| Android 12+ | Supported | Splash / blur APIs via Expo |
| Android 13+ | Supported | Notification permission path |
| Android 14+ | Supported | Partial media / photo pickers |
| Android 15+ | Target | Edge-to-edge — retest insets |
| iPhone SE | Supported | Compact width + Small font stress |
| iPhone 13 / 14 | Supported | Baseline |
| iPhone 15 / 16 | Supported | Dynamic Island safe area |
| iPad / tablets | Supported | Centered content width |
| Landscape | Supported | Horizontal pad from responsive hook |
| Portrait | Default | — |

## Layout audit checklist

- [x] Safe area provider at root  
- [x] Responsive content helper available  
- [ ] Visual pass on SE-class width with Extra Large fonts  
- [ ] Visual pass on tablet landscape for dashboards  
- [ ] Landscape home tabs do not clip tab labels (i18n Hindi)  

## Known risks

- Segmented controls with 4 font-size options may wrap on SE — verify Appearance screen.
- Dense institution admin dashboards benefit most from tablet max-width.

## Manual QA recommended

1. Expo Go or release build on physical SE-class Android + iPhone SE simulator.  
2. iPad simulator portrait + landscape.  
3. Android 15 emulator for edge-to-edge insets.  
