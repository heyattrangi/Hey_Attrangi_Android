# Hey Attrangi — UI Audit Report

**Sprint:** 15 – Pixel Perfect UI Audit & Design Compliance  
**Date:** 15 July 2026  
**App:** `expo-app` (Expo frontend)  
**Source of truth:** `HeyAatrangi/designs/` (+ ui-states under `expo-app/src/assets/ui-states/`)  
**Scope:** Frontend visual / component quality only. No backend, API, or Prisma changes.

**Priority legend**

| Priority | Meaning |
|----------|---------|
| **P0** | Blocks Design compliance / shipping visual QA |
| **P1** | Clear Design mismatch; fix before production polish sign-off |
| **P2** | Consistency / debt; fix in cleanup pass |
| **P3** | Nice-to-have / docs gap |

---

## 1. Screen inventory summary

| Status | Count | Notes |
|--------|------:|-------|
| Implemented (Design-aligned enough) | 0 | No screen fully pixel-matched |
| Partially Implemented | 28 | Has Design PNG + navigable UI; gaps remain |
| Needs Redesign | 5 | Structure diverges from Design structure |
| Missing Design asset (code exists) | ~22 | Journal, Wellness, Settings extras, etc. |
| Missing screen (Design exists, unused) | 1 | `AI.png` mode picker not implemented as designed |
| Dev-only | 1 | `UiStatesDemo` |

**Total screens in codebase:** 56  
**Design folder screen PNGs:** 27  
**UI wireframes (auth/onboarding):** 11 (near-duplicates of designs `1–11`)  
**UI-state overlays:** ~80 assets (dialogs / empty / loading / success)

Product Vision / PRD / User Flow / UI Screen Spec documents are **not present** in the repo (only referenced by older `SCREEN_AUDIT.md`). Audit therefore weights **Design folder** first.

---

## 2. Issues by area

### 2.1 Auth & registration

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| A-01 | P1 | SignIn | Google button uses hardcoded `#4285F4` | Move to `Colors` token (e.g. `brandGoogle`) or approved DS accent |
| A-02 | P1 | SignIn | Layout / logo / CTA density vs `1.png` not verified pixel-perfect | Side-by-side pass: margins, CTA height, logo size against `1.png` |
| A-03 | P2 | Welcome | Exists; alignment to `2.png` incomplete | Match hero illustration size, CTA stack, copy hierarchy |
| A-04 | P2 | Splash | No Design PNG; brand naming inconsistency historically | Confirm with Design; align “Hey Attrangi” wordmark |
| A-05 | P2 | ForgotPassword | No Design PNG | Request Design or freeze as utility screen with DS tokens only |
| A-06 | P1 | SignUpBasic → TrustedContact | Flow matches `3–6.png` partially; field set / spacing needs Design pass | Pixel audit each registration screen vs numbered PNGs |
| A-07 | P2 | OTPVerify | Uses `OTPInput` (good); resend / digit box size vs `4.png` | Measure OTP cell size, gap, CTA against Design |

### 2.2 Onboarding / personalization

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| O-01 | P1 | MoodCheck / ReasonTags | `SelectionCard` hardcodes `#FFF7E8`, `#E8E8E6`, `#D4A574` | Replace with `Colors.peachMuted`, `Colors.borderDefault`, `Colors.primary` |
| O-02 | P2 | All onboarding | Dual `MoodCard` (`ui` vs `personalization`) | Keep one; deprecate the other |
| O-03 | P1 | Screens `7–11.png` | Spacing / progress indicator vs Design | Align `ProgressIndicator` and card radii to Design |

### 2.3 Home

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| H-01 | P0 | Home | **Needs Redesign** vs `Home.png` | Rebuild section order & card chrome to match Design |
| H-02 | P0 | Home | Explore is **2 cards** in Design; app exposes more quick actions (Journal / Wellness) | Hide extras or match Design 2-up grid exactly; relocate extras below fold if Spec allows |
| H-03 | P1 | Home | Daily check-in Design = empty bordered card; app uses richer check-in card | Match empty/prompt card from Design |
| H-04 | P1 | Home | Mood row: Design uses 5 emoji cards with orange selected border; verify chip sizes | Align `MoodChipRow` to Design card size / selected border |
| H-05 | P1 | Home | Imports `theme` barrel instead of `app/design-system` | Migrate imports (tokens identical; path hygiene) |
| H-06 | P2 | Home | Extra sections (therapist rail, insights) not in `Home.png` | Move below Design-first viewport or gate behind Design update |

### 2.4 Companion / Chat

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| C-01 | P0 | Chat | **Needs Redesign** vs `Chat screen.png` | Match header (“Just listen” + subtitle), centered avatar, bubble styles, composer |
| C-02 | P0 | Chat | Design composer: grey pill + **orange circular mic**; app uses different composer (mic/send) | Rebuild composer to Design |
| C-03 | P1 | Chat | User bubble should be peach/orange fill; AI bubble white + grey border | Align `ChatBubble` tokens |
| C-04 | P1 | Chat | `AI.png` mode-picker empty state **not used** (Companion intentionally skipped modes) | Either restore Design empty or get Design sign-off on Companion empty |
| C-05 | P2 | Chat | Tab label “Companion” / “Chat” vs Design “Just listen” header | Keep header Design-accurate; resolve tab label with Spec |

### 2.5 Mood

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| M-01 | P1 | MoodTracking | Closest to `Mood tracker (scrollable).png`; scroll sections / CTA need pixel pass | Section spacing, slider, save CTA vs Design |
| M-02 | P2 | MoodHistory / Analytics / Calendar / Detail | **No Design PNGs** | Freeze DS-only OR request Design pack |
| M-03 | P2 | Mood | History empty uses ui-states; verify illustration match | Wire `empty.moodHistory` frames |

### 2.6 Therapists & sessions

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| T-01 | P1 | TherapistList | Mapped to `Scheduled sessions.png` (title “Schedule”); app is marketplace list | Match search bar, card, filters chrome to Design |
| T-02 | P1 | TherapistList | Still imports `theme`; FlatList nested with `scrollEnabled={false}` | Prefer single scroll surface; design-system imports |
| T-03 | P1 | Booking | `B2C.png` / `B2B2C.png` CTA variants | Ensure progress, calendar, slots, CTA match selected Design |
| T-04 | P1 | Payment | `Payment.png` + `Payment (1).png` | Match option cards, totals, primary CTA |
| T-05 | P2 | Sessions | Weak Design mapping | Align list cards to Home session card language |
| T-06 | P0 | VideoSession | **No Design**; placeholder UI | **Needs Redesign** once Design delivered |
| T-07 | P2 | TherapistProfile | Soft Design coverage via booking headers | Align avatar, chips, book CTA |

### 2.7 Journal & Wellness

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| J-01 | P1 | All Journal (3) | **No Design PNGs** | Request Design pack; until then enforce DS tokens only |
| W-01 | P1 | All Wellness (4) | **No Design PNGs** | Same as Journal |
| J-02 | P2 | JournalEntry | Modal presentation; verify against future Design | Keep modal until Design specifies |

### 2.8 Profile & settings

| ID | Priority | Screen | Issue | Suggested fix |
|----|----------|--------|-------|---------------|
| P-01 | P0 | Profile | **Needs Redesign** vs `Profile.png` | Design = title + subtitle + **5 text rows, no chevrons, no avatar**. App = ProfileCard + completion + many sections |
| P-02 | P1 | Profile | Extra rows (AI Companion, Appearance, Help, etc.) not in Design | Relocate to Settings or obtain updated Design |
| P-03 | P1 | Personal Info / Email / Devices / Notifications / Billing / Care Credits | Design PNGs exist; need pixel pass | Per-screen spacing / list / form audit |
| P-04 | P2 | Settings + 12 extras | No Design PNGs | DS-only freeze or Design request |
| P-05 | P2 | Profile | Mixed `design-system` + `theme/icons` | Unify imports |

### 2.9 Design system & components (cross-cutting)

| ID | Priority | Screen / Component | Issue | Suggested fix |
|----|----------|-------------------|-------|---------------|
| DS-01 | P0 | Import paths | ~29 screens / many components still import `theme` | Migrate all to `app/design-system` |
| DS-02 | P1 | EmptyState | Three layers: `ui/states/EmptyState`, `async/EmptyStateView`, **`app/EmptyState` (legacy)** | Delete or re-export-only `app/EmptyState`; standardize on `ui/states` |
| DS-03 | P1 | MoodCard | Duplicate: `ui/MoodCard` + `personalization/MoodCard` | Single component |
| DS-04 | P2 | Buttons | Canonical `ui/PrimaryButton` + `common` re-exports | Screens should import only from `components/ui` |
| DS-05 | P2 | Inputs | `Input` → `TextInput` → `AppInput` naming stack | Document canonical = `ui/Input`; deprecate aliases gradually |
| DS-06 | P2 | DesignDialog | `ui/dialogs/DesignDialog` + `ui-states` shim | Keep one public export path |
| DS-07 | P1 | SelectionCard / IllustrationGlow | Hardcoded hex outside Colors.ts | Tokenize |
| DS-08 | P2 | Typography | `optionTitle` uses raw `fontSize: 15` (off 4pt scale) | Use `FontSize` token |
| DS-09 | P2 | Spacing | DS is **4dp** base; Sprint brief asked 8-point grid | Confirm with Design; document as 4dp with even steps = 8pt rhythm |
| DS-10 | P3 | Toast vs Snackbar | Two feedback surfaces | Keep both if intentional; document when to use which |

### 2.10 Accessibility

| ID | Priority | Area | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| AC-01 | P1 | Many list rows | Not all rows enforce `MIN_TOUCH_TARGET` (48) | Audit SettingsItem / custom rows |
| AC-02 | P2 | Labels | Partial coverage of `accessibilityLabel` / hints | Pass per screen checklist |
| AC-03 | P2 | Dynamic type | Inconsistent `maxFontSizeMultiplier` | Standardize on interactive text |
| AC-04 | P1 | Reduce motion | Pref + hook exist; not all animations consume `useReducedMotion` | Wire remaining Reanimated enters |
| AC-05 | P2 | Contrast | Orange-on-peach / muted captions need WCAG spot-check | Contrast audit on captions |

### 2.11 Performance

| ID | Priority | Area | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| PF-01 | P1 | TherapistList | FlatList inside ScrollView (`scrollEnabled={false}`) | Single FlatList + ListHeaderComponent |
| PF-02 | P2 | Home | Many animated sections remount | Respect reduce motion; avoid unnecessary entering |
| PF-03 | P2 | Images | RN `Image` via `AppImage`, not `expo-image` | Optional upgrade later |
| PF-04 | P3 | Unused | Confirm unused assets after Design freeze | Asset audit pass |

### 2.12 Interaction & navigation

| ID | Priority | Area | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| I-01 | P2 | Tabs | Order Home → Chat → Mood → Therapists → Profile | Confirm vs Spec (older audit claimed Spec order differs) |
| I-02 | P2 | Modals | JournalEntry / Breathing / Video use modal presentations | Verify gesture + safe area |
| I-03 | P2 | Dialogs | Design dialogs largely wired | Pixel-check Logout / Discard vs Design PNGs |
| I-04 | P3 | Keyboard | Form screens use `FormScreen`; spot-check OTP / chat | KeyboardAvoiding consistency |

---

## 3. Hardcoded colors (outside Design System tokens file)

| File | Values | Action |
|------|--------|--------|
| `screens/auth/SignInScreen.tsx` | `#4285F4` | Tokenize |
| `components/personalization/SelectionCard.tsx` | `#FFF7E8`, `#E8E8E6`, `#D4A574` | Tokenize |
| `components/common/IllustrationGlow.tsx` | SVG gradient stops | Acceptable if mapped to Gradients.ts |
| `app/design-system/Colors.ts` | Token definitions | OK |

---

## 4. Duplicate / layered components

| Component | Canonical | Duplicates / aliases | Action |
|-----------|-----------|----------------------|--------|
| PrimaryButton | `ui/PrimaryButton` | `common/PrimaryButton` re-export | Import path only |
| SecondaryButton | `ui/SecondaryButton` | `common/SecondaryButton` | Import path only |
| Input | `ui/Input` | `common/TextInput`, `app/AppInput` | Document canonical |
| EmptyState | `ui/states/EmptyState` | `async/EmptyStateView`, **`app/EmptyState`** | Remove legacy |
| MoodCard | Choose one | `ui/MoodCard`, `personalization/MoodCard` | Merge |
| OTPInput | `ui/OTPInput` | — | OK (single) |
| Toast / Snackbar | Both intentional | — | Document usage |

---

## 5. Recommended fix order

1. **P0 redesigns:** Home, Chat, Profile, VideoSession (await Design for Video)  
2. **Tokenize hardcoded colors** + remove `app/EmptyState` + merge MoodCards  
3. **Pixel pass** Design-backed profile subpages + auth `1–11` + booking/payment  
4. **Migrate `theme` → `design-system` imports**  
5. **Design pack request** for Journal / Wellness / Settings extras / Mood analytics  
6. **A11y + list performance** cleanup  

---

## 6. Out of scope (per Sprint 15)

- Backend / API / Prisma  
- New product features  
- Redesigning without Design folder authority  

---

*End of UI_AUDIT_REPORT.md*
