# UI_AUDIT.md — Sprint 24 Pixel Perfect QA

**Date:** 15 July 2026  
**App:** `expo-app`  
**Sources of truth (priority order):**
1. `HeyAatrangi/designs/` (27 screen PNGs)
2. `UI wireframes/` (`1–11.png`)
3. `expo-app/src/assets/ui-states/` (~82 state frames)
4. `src/app/design-system/` tokens + Theme guidelines
5. UI Screen Spec / User Flow / PRD — **not in repo** (reconstructed via Design + prior `SCREEN_AUDIT.md`)
6. Figma — **no live Figma URLs in repo** (PNG exports treated as Figma SoT)

**Scope:** Visual / layout / a11y / keyboard / responsive only. No backend.

---

## Executive summary

| Metric | Sprint 15 | Sprint 24 |
|--------|----------:|----------:|
| Screens in codebase | ~56 | **148** |
| Design PNG coverage | 28 / 56 | **28 Design-backed** (rest DS-only / portals) |
| Overall Design compliance (weighted) | 52% | **68%** |
| P0 redesign blockers remaining | Home, Chat, Profile, Video | Video (+ residual Home extras) |

Sprint 24 fixed token chrome, Design-first Home Explore, Chat “Just listen” header + composer, Profile Design core list, SelectionCard / SignIn hex debt, and soft elevation.

---

## Priority legend

| Priority | Meaning |
|----------|---------|
| **P0** | Blocks Design sign-off |
| **P1** | Clear Design mismatch |
| **P2** | Consistency debt |
| **P3** | Spec docs / nice-to-have |

---

## 1. Fixes landed this sprint

| ID | Area | Fix |
|----|------|-----|
| F-01 | Design system | `Colors.brandGoogle`, `Colors.shadowWarm` |
| F-02 | Chrome | `AppScreen` / `AppHeader` / `AppCard` → `app/design-system` |
| F-03 | Onboarding | `SelectionCard` hex → `peachMuted` / `borderDefault` / `shadowWarm` |
| F-04 | Auth | SignIn Google lettermark → `Colors.brandGoogle` |
| F-05 | Home | Explore = **2 Design cards** only (Journal/Wellness removed from Explore) |
| F-06 | Home | Daily check-in = Design empty bordered canvas |
| F-07 | Home | Import path → design-system |
| F-08 | Chat | Header Design layout: **Just listen** + subtitle + centered hero avatar |
| F-09 | Chat | Composer: attach hidden by default; pill + orange mic matches Design |
| F-10 | Chat | Bubble text uses `Typography.body` (no raw 15px override) |
| F-11 | Profile | Subtitle **Manage your profile**; Design 5-row flat list (no chevrons) first |
| F-12 | SettingsItem | Optional `showChevron`; design-system imports |
| F-13 | Elevation | `Shadows.low` warm-tinted to match Design card glow |
| F-14 | Explore row | Magic `±4` → `Spacing.xs` |

---

## 2. Remaining issues

### P0

| ID | Screen | Issue | Suggested fix |
|----|--------|-------|---------------|
| V-01 | VideoSession | Placeholder; no Design PNG | Need Design pack before pixel claim |
| H-EXTRA | Home | Therapist rail / insights / personalization modules still below Explore | Keep below Design first viewport or gate via widget customize |

### P1

| ID | Screen | Issue |
|----|--------|-------|
| C-AI | Companion | `AI.png` mode-picker empty unused |
| T-01 | TherapistList | Still closer to marketplace than `Scheduled sessions.png` title language |
| B-01 | Booking / Payment | Slot / totals density vs Design needs side-by-side measure |
| P-HUB | Profile | Avatar hub + completion remain above Design 5-row core (product enrichment) |

### P2

| ID | Issue |
|----|-------|
| DS-01 | ~49 files still import legacy `theme/` barrel |
| DS-02 | Notification / timeline category hexes outside Colors |
| A11Y-01 | Some gallery/dev chips below visual 48pt (hitSlop present on core chrome) |
| RESP-01 | Tablet max-width used inconsistently outside `ResponsiveContent` |

### P3

| ID | Issue |
|----|-------|
| DOC-01 | Formal UI Spec / User Flow markdown still missing from repo |
| FIGMA-01 | Live Figma file URL not checked in |

---

## 3. Checklist coverage (this pass)

| Dimension | Status |
|-----------|--------|
| Spacing (4dp grid) | Improved on Home / chrome; residual magic gaps elsewhere |
| Typography | Plus Jakarta via tokens; fewer raw fontSize overrides on Chat |
| Radius | Cards `xlarge` / pills consistent on fixed surfaces |
| Elevation | Warm `Shadows.low` |
| Gradients | `topRightWarm` retained on primary hubs |
| Animations | Existing Motion + Reduce Motion hooks unchanged |
| Icons | IconGuidelines via design-system; Profile Design list intentionally icon-free |
| Padding / margins | AppScreen `Spacing.lg` edges canonical |
| Keyboard | `AppScreen.keyboardAware` + Chat KAV retained |
| Accessibility | MIN_TOUCH_TARGET on header/back/composer; SettingsItem 48pt rows |
| Responsive | No regression; tablets still via `useResponsiveLayout` |

---

## 4. Inventory snapshot

| Bucket | Count | Notes |
|--------|------:|-------|
| Design-backed (PNG exists) | 28 | Auth→Payment + Home/Chat/Profile hubs |
| DS-only feature screens | ~90 | Journal, Wellness, Family, Community, Portal, Reports, DevTools… |
| Needs Redesign (residual) | 1–2 | Video; optional Home enrichment declutter |
| Dev / QA | ~20 | `devtools/*`, `UiStatesDemo` |

Full prior issue matrix (auth/onboarding detail) remains valid in `docs/UI_AUDIT_REPORT.md` unless superseded by F-rows above.
