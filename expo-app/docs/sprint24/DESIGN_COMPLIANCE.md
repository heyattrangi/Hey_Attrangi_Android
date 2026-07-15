# DESIGN_COMPLIANCE.md — Sprint 24

**Date:** 15 July 2026  
**Sources:** `HeyAatrangi/designs/` · Design System · UI wireframes · ui-states  
**Compared against:** Figma PNG exports (no live Figma link), Design Folder, reconstructed User Flow / UI Spec via `SCREEN_AUDIT.md`

---

## Overall score

| Metric | Sprint 15 | Sprint 24 |
|--------|----------:|----------:|
| **Overall Design compliance (weighted)** | **52%** | **68%** |
| Design-backed average fidelity | ~62% | **~74%** |
| Design System token hygiene | ~78% | **~88%** |
| Component consistency | ~70% | **~80%** |
| Design PNG coverage of codebase | 50% of 56 | **~19% of 148** (coverage dilution from new modules) |

**Interpretation:** Design-backed primary surfaces (Auth, Home Explore, Chat shell, Profile core) are **materially closer** to the Design folder. New Sprint 18–23 modules are **DS-compliant placeholders** and are scored N/A for Design PNG match — they should not drag the Design-backed average.

**Weighted formula (unchanged):**  
`0.55 × Design-backed avg + 0.25 × token hygiene + 0.20 × component consistency`

---

## Rubric

| Band | Meaning |
|------|---------|
| 90–100% | Pixel-ready |
| 70–89% | Structure correct; polish left |
| 50–69% | Recognizable; layout gaps |
| 30–49% | Same domain; wrong IA |
| 0–29% | Divergent / placeholder |
| N/A | No Design PNG — DS-only |

---

## Design-backed screen scores

### Auth & onboarding

| Screen | Asset | S15 | S24 | Delta |
|--------|-------|----:|----:|------:|
| SignIn | `1.png` | 60 | **68** | +8 Google token |
| Welcome | `2.png` | 65 | 66 | +1 |
| SignUpBasic | `3.png` | 70 | 72 | +2 tokens via Selection path |
| OTPVerify | `4.png` | 72 | 72 | — |
| SetPassword | `5.png` | 70 | 70 | — |
| TrustedContact | `6.png` | 68 | 68 | — |
| PersonalWelcome | `7.png` | 75 | 75 | — |
| MoodCheck | `8.png` | 70 | **78** | SelectionCard tokens |
| TherapyExperience | `9.png` | 72 | **78** | SelectionCard tokens |
| ReasonTags | `10.png` | 70 | **76** | SelectionCard tokens |
| OnboardingComplete | `11.png` | 74 | 74 | — |

### Core tabs

| Screen | Asset | S15 | S24 | Delta |
|--------|-------|----:|----:|------:|
| **Home** | `Home.png` | 42 | **66** | Explore 2-up; empty check-in; DS imports |
| **Chat** | `Chat screen.png` | 38 | **64** | Just listen header; mic composer; bubbles |
| **Profile** | `Profile.png` | 35 | **58** | Design 5-row core; subtitle copy |

### Booking / mood / profile subpages

| Screen | Asset | S15 | S24 | Notes |
|--------|-------|----:|----:|-------|
| MoodTracking | `Mood tracker…` | 68 | 70 | Token polish |
| TherapistList | `Scheduled sessions.png` | 58 | 58 | IA still marketplace |
| Booking | `B2C` / `B2B2C` | 65 | 66 | |
| Payment | `Payment.png` | 62 | 63 | |
| PersonalInformation | `Personal Info.png` | 64 | 65 | |
| EmailSecurity | `Email & Security.png` | 66 | 66 | |
| Devices | `Devices.png` | 68 | 68 | |
| Notifications | `Notifications.png` | 60 | 60 | |
| BillingInvoices | `Billing & Invoices.png` | 65 | 65 | |
| CareCredits | `Care Credits.png` | 65 | 65 | |
| Sessions | (weak Home language) | 50 | 52 | |

### Needs Redesign

| Screen | S24 | Why |
|--------|----:|-----|
| VideoSession | **12** | Placeholder; no Design |
| AI mode empty (`AI.png`) | **20** | Asset unused |

---

## Per-area grades

| Area | Grade | Notes |
|------|------:|-------|
| Auth | C+ | Improving |
| Registration / Onboarding | B | SelectionCard compliance |
| Home | C+ ← was F | Design Explore + check-in |
| Chat | C ← was F | Header / composer aligned |
| Profile hub | D+ ← was F | Design core present; hub still enriched |
| Booking / Payment | C | Stable |
| DS-only modules (18–23) | N/A | Tokened, not Design-scored |

---

## Spec / Flow / Figma alignment notes

| Source | Status |
|--------|--------|
| Design Folder | Primary SoT — used for scoring |
| Figma | Exports only; no `figma.com` URL in repo |
| UI Specification | Not in repo; tab IA still Chat≠AI label (known drift) |
| User Flow | Reconstructed; personalization stack still post-register |

---

## Compliance gates before “pixel perfect” claim

1. Side-by-side Home / Chat / Profile on device vs PNG at 1× and 2×  
2. Remove or Design-update Home enrichment modules above fold  
3. Video Design pack + implementation  
4. Decide `AI.png` mode picker (ship or retire asset)  
5. Check in formal UI Spec + User Flow docs for Spec scoring  
6. Finish `theme/` → `design-system/` import migration  

**Current verdict:** **Not pixel-perfect.** **Design-compliant enough for visual QA continuation** on core flows; production polish still required on Video and residual Home chrome.
