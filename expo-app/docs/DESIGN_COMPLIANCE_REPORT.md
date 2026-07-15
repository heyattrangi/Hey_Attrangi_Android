# Hey Attrangi — Design Compliance Report

**Sprint:** 15 – Pixel Perfect UI Audit & Design Compliance  
**Date:** 15 July 2026  
**Source of truth:** `HeyAatrangi/designs/`  
**Method:** Screen inventory + Design PNG visual comparison + design-system token audit  
**Scoring:** Visual / structural match to Design folder (0–100%). Product Spec docs not in repo.

---

## Overall compliance score

| Metric | Score |
|--------|------:|
| **Overall Design compliance (weighted)** | **52%** |
| Screens with Design PNG coverage | 28 / 56 (50%) |
| Average fidelity among Design-backed screens | ~62% |
| Design System token adoption (approx.) | ~78% |
| Component uniqueness (no harmful duplicates) | ~70% |

**Interpretation:** The app is **functionally broad** but **not pixel-perfect**. Auth/onboarding and several profile subpages are closest. Home, Chat, and Profile hub fail structural Design match. Journal/Wellness/Settings extras cannot be scored against Design (no assets).

---

## Scoring rubric

| Band | Meaning |
|------|---------|
| 90–100% | Pixel-ready; only micro-adjustments |
| 70–89% | Structure correct; spacing/type/color polish needed |
| 50–69% | Recognizable; material layout/component gaps |
| 30–49% | Same domain; wrong IA or major chrome differences |
| 0–29% | No Design, or placeholder / divergent product UI |
| N/A | No Design PNG — excluded from Design average; listed separately |

**Weighted overall** = 0.55 × (avg of Design-backed) + 0.25 × (token hygiene) + 0.20 × (component consistency).

---

## 1. Inventory by status

### Implemented (pixel-ready)

_None at Sprint 15 close._

### Partially Implemented (Design exists; gaps)

| Screen | Design asset | Match % | Notes |
|--------|--------------|--------:|-------|
| Welcome | `2.png` | 65 | Entry flow present |
| SignIn | `1.png` | 60 | Google hex; layout polish |
| SignUpBasic | `3.png` | 70 | |
| OTPVerify | `4.png` | 72 | OTPInput present |
| SetPassword | `5.png` | 70 | |
| TrustedContact (reg) | `6.png` | 68 | |
| PersonalWelcome | `7.png` | 75 | |
| MoodCheck | `8.png` | 70 | SelectionCard hex |
| TherapyExperience | `9.png` | 72 | |
| ReasonTags | `10.png` | 70 | |
| OnboardingComplete | `11.png` | 74 | |
| MoodTracking | `Mood tracker (scrollable).png` | 68 | Closest mood Design |
| TherapistList | `Scheduled sessions.png` | 58 | Marketplace vs “Schedule” framing |
| TherapistProfile | Soft (B2C header) | 55 | |
| Booking | `B2C.png` / `B2B2C.png` | 65 | |
| Payment | `Payment.png` | 62 | |
| BookingConfirmation | ui-states confirmed | 70 | State overlay |
| PersonalInformation | `Personal Info.png` | 64 | Richer than Design form |
| EmailSecurity | `Email & Security.png` | 66 | |
| Devices | `Devices.png` | 68 | |
| Notifications | `Notifications.png` | 60 | Extra toggles vs Design |
| BillingInvoices | `Billing & Invoices.png` | 65 | |
| CareCredits | `Care Credits.png` | 65 | |
| Sessions | Weak Home session language | 50 | |

### Needs Redesign

| Screen | Design asset | Match % | Why |
|--------|--------------|--------:|-----|
| **Home** | `Home.png` | **42** | Extra explore actions; check-in & section chrome diverge; Insights/rail not in Design |
| **Chat / Companion** | `Chat screen.png` | **38** | Header, avatar block, bubbles, composer (mic circle) diverge; `AI.png` unused |
| **Profile** | `Profile.png` | **35** | Design = 5-row sparse list; app = avatar hub + completion + many sections |
| **VideoSession** | — | **10** | Placeholder; no Design |
| *(Historical)* Splash branding | — | 40 | No Design PNG |

### Missing Design (code exists — compliance N/A)

Splash, ForgotPassword, MoodHistory, MoodAnalytics, MoodCalendar, MoodDetail, JournalHome, JournalEntry, JournalTemplates, WellnessHub, BreathingExercise, Affirmations, WellnessProgress, Settings, AppSearch, InvoiceDetail, AiCompanionSettings, Appearance, Language, PrivacySecurity, Permissions, TrustedContacts (profile), EmergencyContacts, BiometricLogin, HelpCenter, HelpArticle, AccountManagement, UiStatesDemo.

**Action:** Request Design pack **or** freeze as DS-only utilities (no claim of Design compliance).

### Design assets without matching screen behavior

| Asset | Status |
|-------|--------|
| `AI.png` | Mode-picker empty **not implemented** (Companion empty differs) |
| `Payment (1).png` | Alt state; not clearly mapped |
| `B2B2C.png` | Near-duplicate of B2C (CTA copy) |

---

## 2. Per-area compliance

| Area | Design coverage | Avg match % | Grade |
|------|-----------------|------------:|-------|
| Auth | High (`1–2`) | 62 | C |
| Registration | High (`3–6`) | 70 | B− |
| Onboarding | High (`7–11`) | 72 | B− |
| Home | Has PNG | 42 | F (redesign) |
| Chat | Has PNG + unused AI | 38 | F (redesign) |
| Mood | Tracker only | 55* | D+ |
| Therapists / Booking / Payment | Medium | 60 | C |
| Sessions / Video | Weak / none | 30 | F |
| Journal | None | N/A | — |
| Wellness | None | N/A | — |
| Profile hub | Has PNG | 35 | F (redesign) |
| Profile subpages (6 Design) | High | 64 | C |
| Settings extras | None | N/A | — |

\*Mood average pulls down History/Analytics (no Design).

---

## 3. Design consistency (reusable components)

| Component | Single implementation? | Compliance note |
|-----------|------------------------|-----------------|
| PrimaryButton | Yes (+ re-export) | OK |
| SecondaryButton | Yes (+ re-export) | OK |
| Input / OTPInput | Yes (+ aliases) | Prefer `ui/Input` / `ui/OTPInput` |
| SearchBar | Yes | OK |
| Avatar | Yes | OK |
| Toast / Snackbar | Two intentional | Document |
| Empty states | **No** — legacy `app/EmptyState` | Fix |
| MoodCard | **No** — dual | Fix |
| Cards | Many feature cards + `AppCard` | Acceptable if radii/shadows from DS |
| Dialogs | DesignDialog + wrappers | Mostly OK |
| Bottom sheets | Filter sheet etc. | Spot-check Motion tokens |
| Chips / Tags | TagChip, MoodChipRow | Align radii to Design |
| Badges | Scattered | Standardize |

**Component consistency score: 70%**

---

## 4. Typography compliance

| Check | Status |
|-------|--------|
| Font family Plus Jakarta Sans | Pass (loaded in App) |
| Tokens in `Typography.ts` | Pass |
| Heading / body / caption hierarchy | Partial — screens sometimes use ad-hoc weights |
| Letter-spacing / line-height from tokens | Partial |
| Raw `fontSize: 15` in DS (`optionTitle`) | Fail (off scale) |
| Screens bypassing Typography | Occasional | 

**Typography score: 74%**

---

## 5. Color compliance

| Check | Status |
|-------|--------|
| Brand orange `#F5A623` in DS | Pass |
| Surfaces / text / semantic tokens | Pass |
| Screens hardcoded hex | Fail — SignIn Google, SelectionCard |
| Gradients / glow | Mostly via DS Gradients; SVG glow has stops |
| Disabled / border / success green | Pass if used via tokens |

**Color score: 82%** (high token use; few hardcodes)

---

## 6. Spacing & layout compliance

| Check | Status |
|-------|--------|
| Spacing scale (4dp base, even = 8pt rhythm) | Pass tokens |
| Screen horizontal `Spacing.lg` (24) | Mostly |
| Safe areas via AppScreen / SafeAreaProvider | Pass |
| Bottom tab clearance | Spot-check needed |
| Home / Profile vertical rhythm vs Design | Fail (redesign) |
| Card padding / radius from Radius tokens | Partial |

**Spacing score: 68%**

---

## 7. Interaction / motion compliance

| Check | Status |
|-------|--------|
| Motion tokens exist | Pass |
| Press opacity via Motion | Partial |
| Reduce motion wired (FadeIn, Home, StateCanvas) | Partial |
| Dialog / sheet animations | Partial |
| Chat / Home entering animations vs Design calm | Review |

**Interaction score: 66%**

---

## 8. Accessibility compliance (Design-adjacent)

| Check | Status |
|-------|--------|
| MIN_TOUCH_TARGET 48 | Partial |
| a11y helpers exist | Pass |
| Labels on primary CTAs | Partial |
| Dynamic fonts | Partial |
| High contrast / reduce motion prefs (UI) | Pref exists; apply incomplete |

**A11y score: 62%**

---

## 9. Match % dashboard (Design-backed only)

```
Registration / Onboarding ████████████████░░░░  ~71%
Auth                        ████████████░░░░░░░░  ~62%
Profile subpages            ████████████░░░░░░░░  ~64%
Booking / Payment           ████████████░░░░░░░░  ~63%
Mood tracker                █████████████░░░░░░░  ~68%
Therapist list              ███████████░░░░░░░░░  ~58%
Home                        ████████░░░░░░░░░░░░  ~42%
Chat                        ███████░░░░░░░░░░░░░  ~38%
Profile hub                 ███████░░░░░░░░░░░░░  ~35%
```

---

## 10. Path to 90%+ compliance

1. Redesign **Home**, **Chat**, **Profile** to Design PNGs (accept product extras only with updated Design).  
2. Pixel-pass **auth 1–11**, **mood tracker**, **booking/payment**, **profile subpages**.  
3. Eliminate hardcoded colors + EmptyState/MoodCard duplicates.  
4. Obtain Design for Journal, Wellness, Video, Settings extras — or mark them non-Design-scoped.  
5. Re-score after visual QA on device (iPhone SE + large phone + tablet).

**Target overall after P0–P1:** ~85–90% Design-backed; overall app score depends on Design coverage expansion.

---

*End of DESIGN_COMPLIANCE_REPORT.md*
