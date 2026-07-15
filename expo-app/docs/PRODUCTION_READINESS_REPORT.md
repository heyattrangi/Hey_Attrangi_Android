# Hey Attrangi — Production Readiness Report

**Sprint:** 15 – Pixel Perfect UI Audit & Design Compliance  
**Date:** 15 July 2026  
**App:** `expo-app`  
**Focus:** Frontend visual quality & Design compliance (no backend / API / Prisma)

---

## Executive verdict

| Dimension | Status |
|-----------|--------|
| **Visual production-ready (Design pixel-perfect)** | **Needs Work** |
| **Functional navigation / mock UX** | **Ready** for internal demos |
| **Design System foundation** | **Ready** (tokens exist) |
| **Component uniqueness** | **Needs Work** |
| **Accessibility** | **Needs Work** |
| **Performance (lists / images)** | **Needs Work** |
| **Backend integration architecture** | Out of Sprint 15 scope (already prepared earlier) |

**Overall frontend visual readiness:** **Not production-ready** for a Design-signed release.  
**Demo / dogfood readiness:** **Ready** with known Design debt.

---

## 1. Ready

These areas are stable enough for continued development and demos:

| Item | Notes |
|------|-------|
| Navigation graph | Auth → Onboarding → Main tabs + stack; deep links prepared |
| Design System tokens | Colors, Typography, Spacing, Radius, Motion, Elevation |
| UI state catalog | Empty / loading / dialog / success overlays |
| Auth → Onboarding flow | Navigable; Design `1–11` partially applied |
| Booking → Payment mock path | Usable end-to-end with mocks |
| Mood check-in | Usable; Design tracker partial |
| Profile subpages with Design PNGs | Usable; need polish |
| Feedback hosts | Toast, Snackbar, Offline banner, ErrorBoundary |
| Reduce-motion hooks | Present; partially applied |

---

## 2. Needs Work

| Item | Priority | Owner focus |
|------|----------|-------------|
| Home vs `Home.png` | P0 | Structural redesign |
| Chat vs `Chat screen.png` | P0 | Composer, bubbles, header, avatar |
| Profile vs `Profile.png` | P0 | Sparse 5-row hub vs rich hub conflict |
| Pixel pass Design-backed screens | P1 | Auth, booking, payment, profile forms |
| Remove legacy EmptyState + dual MoodCard | P1 | Component hygiene |
| Hardcoded colors | P1 | SignIn, SelectionCard |
| Migrate `theme` imports → `design-system` | P2 | Consistency |
| Therapist list scroll architecture | P1 | Performance |
| A11y touch targets & labels | P1 | Production a11y |
| Wire reduce motion everywhere | P2 | Motion compliance |
| Tab IA / labels vs Spec | P2 | Confirm Spec when docs available |

---

## 3. Critical issues

| # | Issue | Impact | Blocking? |
|---|-------|--------|-----------|
| 1 | **Home / Chat / Profile fail Design structure** | Cannot claim Design compliance | **Yes** for Design sign-off |
| 2 | **`AI.png` unused; Companion empty differs** | Design orphan | Yes if Design insists on mode picker |
| 3 | **~22 screens with no Design PNG** (Journal, Wellness, Settings extras) | Cannot pixel-QA | Yes for “every screen Design-matched” definition |
| 4 | **VideoSession has no Design + placeholder UI** | Session feature not shippable visually | Yes for video launch |
| 5 | **Product Spec docs missing from repo** | Spec vs Design conflicts unresolved (e.g. Profile hub) | Process risk |
| 6 | **Legacy EmptyState + hardcoded colors** | Inconsistent chrome | No for demo; Yes for polish |

---

## 4. Ready / Needs Work / Critical — by product area

| Area | Ready | Needs Work | Critical |
|------|:-----:|:----------:|:--------:|
| Auth | | ✓ | |
| Registration / Onboarding | | ✓ | |
| Home | | | ✓ |
| Chat / Companion | | | ✓ |
| Mood | | ✓ | |
| Therapists / Booking / Payment | | ✓ | |
| Sessions list | | ✓ | |
| Video | | | ✓ |
| Journal | | ✓* | |
| Wellness | | ✓* | |
| Profile hub | | | ✓ |
| Profile Design subpages | | ✓ | |
| Settings extras | | ✓* | |
| Design System | ✓ | ✓ (dupes) | |
| A11y / Perf | | ✓ | |

\*Needs Design pack or explicit “DS-only, no Design claim” exemption.

---

## 5. Estimated remaining work (frontend visual only)

Assumes 1 engineer familiar with the codebase; device QA included lightly.

| Workstream | Hours (low–high) | Notes |
|------------|-----------------:|-------|
| Home redesign to `Home.png` | 24–40 | Incl. explore 2-up, check-in, mood row |
| Chat redesign to `Chat screen.png` | 32–48 | Composer + bubbles + header; resolve AI.png |
| Profile hub redesign to `Profile.png` | 12–20 | Or Design update to allow rich hub |
| Auth / onboarding pixel pass (`1–11`) | 24–36 | |
| Booking + Payment pixel pass | 16–24 | |
| Profile subpages pixel pass (6 screens) | 16–24 | |
| Mood tracker pixel pass | 8–12 | |
| Therapist list / sessions polish | 12–20 | |
| Component dedupe + color tokenize + import migration | 12–16 | |
| A11y + FlatList perf pass | 12–20 | |
| Journal / Wellness Design (if assets arrive) | 40–80 | Blocked on Design |
| Video session Design implementation | 40–80 | Blocked on Design + later SDK |
| Device matrix QA (SE / large / tablet / landscape) | 16–24 | |
| **Subtotal (Design-backed P0–P1)** | **~168–260** | |
| **With Journal/Wellness/Video Design packs** | **~248–420** | |

**Midpoint to Design-backed production polish:** **~210 hours** (~5–6 weeks × 1 FE).  
**Midpoint including new Design domains:** **~330 hours**.

---

## 6. Definition of Done (Sprint 15 follow-on)

Sprint 15 **audit deliverables** are complete when the three reports exist.  
**Visual production DoD** (follow-on sprint) requires:

- [ ] Home, Chat, Profile match Design PNGs (or Design updated & signed)  
- [ ] All Design-backed screens ≥ 90% match on device QA  
- [ ] Zero hardcoded colors outside `Colors.ts` / `Gradients.ts`  
- [ ] Single EmptyState + single MoodCard  
- [ ] All imports from `app/design-system` (no `theme` in screens)  
- [ ] Touch targets ≥ 48dp on interactive controls  
- [ ] Reduce motion honored on primary animations  
- [ ] Journal / Wellness / Video either Designed or explicitly exempted  
- [ ] Sign-off checklist completed on small + large phones  

---

## 7. Risk register

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Spec (rich Profile) conflicts with Design (`Profile.png`) | High | Product + Design decision before rebuild |
| Companion product vs `AI.png` mode picker | High | Written Design exception or restore picker |
| Journal/Wellness ship without Design | Medium | Freeze DS patterns; schedule Design sprint |
| Scope creep during pixel pass | Medium | Fix only Design diffs; no new features |

---

## 8. Recommendation

1. **Treat this Sprint as Audit Complete** — reports are the deliverable.  
2. **Open Sprint 15b / Visual Hardening** focused only on P0 redesigns (Home, Chat, Profile) + tokenize/dedupe.  
3. **Do not claim “every screen pixel-perfect”** until Design coverage exists for Journal, Wellness, Video, and Settings extras — or those screens are formally out of Design scope.  
4. Keep **no new features** until P0 Design match is signed.

---

## 9. Report index

| Deliverable | Path |
|-------------|------|
| UI issues & fixes | `expo-app/docs/UI_AUDIT_REPORT.md` |
| Match % & compliance | `expo-app/docs/DESIGN_COMPLIANCE_REPORT.md` |
| Readiness & estimates | `expo-app/docs/PRODUCTION_READINESS_REPORT.md` |
| Prior screen audit (stale in places) | `expo-app/docs/SCREEN_AUDIT.md` |

---

*End of PRODUCTION_READINESS_REPORT.md*
