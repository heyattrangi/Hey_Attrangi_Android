# ACCESSIBILITY_REPORT.md

**Sprint 17** — Hey Attrangi Expo frontend  
**Scope:** VoiceOver / TalkBack readiness, dynamic type, contrast, motion  
**Date:** 2026-07-15

## Executive summary

Accessibility is treated as a **shared utilities + appearance prefs** layer. Most interactive components already use `buttonA11y` / `MIN_TOUCH_TARGET` (48). Sprint 17 expands a11y helpers, typography scaling (Small → XL), high-contrast preference weight, and Reduce Motion integration.

## Support matrix

| Capability | Status | Notes |
|------------|--------|-------|
| VoiceOver / TalkBack | Ready (labels/hints) | Prefer `buttonA11y`, `cardA11y`, `tabA11y`, `dialogA11y` |
| Dynamic Type | Ready | `AppText` + `maxFontSizeMultiplier` caps per font size pref |
| Large touch targets | Ready | `MIN_TOUCH_TARGET = 48`, `ensureMinTouchSize` |
| Semantic labels | Ready | Expanded helpers in `utils/accessibility.ts` |
| Reduce Motion | Ready | OS + Appearance toggle via `useReducedMotion` |
| High contrast | Pref + soft style | Appearance switch; `AppText` weight bump |
| Focus order | Guidance | `listItemA11y` includes “n of m” |
| Charts/graphs | Partial | Mood analytics use text alternatives — verify labels on device |

## Typography scaling

| Pref | Scale | Max multiplier |
|------|-------|----------------|
| Small | 0.9 | 1.2 |
| Default | 1.0 | 1.35 |
| Large | 1.15 | 1.45 |
| Extra Large | 1.3 | 1.6 |

Configured in Appearance → Font size (`AppearanceScreen`).

## Audit approach by control type

| Control | Helper | Touch target |
|---------|--------|--------------|
| Buttons | `buttonA11y` | ≥48 |
| Cards | `cardA11y` | Pressable min height |
| Inputs | `textInputA11y` | Design system inputs |
| Dialogs | `dialogA11y` + modal | Session / permission dialogs |
| Tabs | `tabA11y` / tabBarAccessibilityLabel | Main tabs i18n labels |
| Sheets | Existing Modal + a11yViewIsModal | Celebration / errors |
| Navigation | Header + tab labels | Stack + tabs |

## Manual Accessibility QA (device)

Verify on one iOS VoiceOver and one Android TalkBack device:

- [ ] Every primary CTA announces name + hint  
- [ ] Cards announce title + action  
- [ ] Inputs announce label + error  
- [ ] Dialogs trap focus / are modal  
- [ ] Bottom tabs announce selection  
- [ ] Reduce Motion disables looping animations  
- [ ] Extra Large font does not clip Home greeting  

## Gaps / follow-ups

- Not every historical string has been migrated to `AppText` / `t()`.
- High contrast does not swap a separate color palette (prefs only) — design tokens for HC can follow.
- Chart paths need explicit `accessibilityRole="summary"` where still missing.

## Key paths

- `src/utils/accessibility.ts`
- `src/components/ui/AppText.tsx`
- `src/i18n/typographyScale.ts`
- `src/hooks/useReducedMotion.ts`
- `src/screens/profile/AppearanceScreen.tsx`
