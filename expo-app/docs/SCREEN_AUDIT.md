# Hey Attrangi — Screen Audit Report

**Date:** 15 July 2026  
**App:** `expo-app` (Expo frontend, mock services)  
**Docs compared:** Product Vision · Product Requirements · Feature Scope · User Flow · UI Screen Specification · Design PNGs  

**Verdict scale**

| Status | Meaning |
|--------|---------|
| **Implemented** | Spec/flow covered; Design-aligned enough to ship with polish only |
| **Partially Implemented** | Screen exists and is usable; material Spec/flow gaps remain |
| **Missing** | Required by Spec/Flow; no screen (or no dedicated UI) |
| **Needs Redesign** | Exists but structure/visuals diverge from Spec/Design enough to rebuild layout |

**Assumptions**

- Phase-1 **user mobile app** is in scope. Therapist Dashboard and Admin Panel are web (out of mobile scope).
- Estimates are **frontend hours** to match Spec + Design (mock→API wiring counted lightly; native video SDK is the large outlier).
- Runtime today: mock services only (`Mock*Service`).

---

## Executive summary

| Category | Count |
|----------|------:|
| Screens in codebase | 33 |
| Implemented | 0 |
| Partially Implemented | 28 |
| Needs Redesign | 5 |
| Missing (mobile) | 4 |
| Out of mobile scope | 2 |

**Phase-1 readiness (user mobile):** ~55–65% of Spec surface is present as navigable UI. Critical blockers for Spec completion: real video session, therapist filters, mood history charts, crisis detection, booking/session notifications, tab IA vs Spec.

**Hours remaining (user mobile, frontend):** **~340–540 hours**  
**Midpoint estimate:** **~440 hours** (~11 weeks × 1 engineer, or ~5–6 weeks × 2)

---

## Cross-cutting gaps (all screens)

| Gap | Spec / Flow reference | Impact |
|-----|----------------------|--------|
| Bottom tabs order/labels | UI Spec §5: Home → Therapists → AI → Mood → Profile | App: Home → Chat → Mood → Therapists → Profile; label “Chat” not “AI” |
| Mock backend | PRD / Feature Scope | All flows succeed without real auth, payments, OTP SMS, video |
| Design System foundation exists | Production UI phase | Many screens still mix legacy layouts; not yet fully on Design PNG fidelity |
| Push / local notifications | Feature Scope §6; User Flow booking confirm | Preference toggles only; no delivery of booking/session reminders |

---

## 1. Auth

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Splash | `screens/auth/SplashScreen.tsx` | Partially Implemented | 2–4 | Brand splash only; no session restore UX; naming “Aatrangi” vs Spec “Hey Attrangi” |
| Welcome | `screens/auth/WelcomeScreen.tsx` | Partially Implemented | 4–6 | Useful entry; not in UI Spec §1; needs Design polish |
| Sign In | `screens/auth/SignInScreen.tsx` | Partially Implemented | 10–14 | Email/phone + password + mock Google. **Missing:** phone-OTP login (Feature Scope), Spec logo header, disabled-until-valid CTA |
| Forgot Password | `screens/auth/ForgotPasswordScreen.tsx` | Partially Implemented | 6–10 | Send-link shell only; no reset completion; misleading success on empty/error |

**Auth subtotal:** 22–34h

---

## 2. Registration

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Sign Up (Basic) | `screens/registration/SignUpBasicScreen.tsx` | Partially Implemented | 10–16 | Name + phone only. Spec §1.2 also needs email, password, age, gender |
| OTP Verify | `screens/registration/OTPVerifyScreen.tsx` | Partially Implemented | 8–12 | Mock any-6-digit; no email confirmation (Feature Scope) |
| Set Password | `screens/registration/SetPasswordScreen.tsx` | Partially Implemented | 4–8 | Strength UI good; does not register until Trusted Contact |
| Trusted Contact | `screens/registration/TrustedContactScreen.tsx` | Partially Implemented | 10–14 | Not in UI Spec Phase-1; hardcoding contact; no native picker |

**Registration subtotal:** 32–50h  
**Flow note (User Flow §3):** Spec implies account → home; app inserts personalization stack after register.

---

## 3. Personalization / Onboarding

*(Not in UI Screen Spec §1; Design/product extension. User Flow redirects to home after account creation.)*

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Personal Welcome | `screens/personalization/PersonalWelcomeScreen.tsx` | Partially Implemented | 3–5 | Extra vs User Flow; polish to Design |
| Mood Check | `screens/personalization/MoodCheckScreen.tsx` | Partially Implemented | 4–6 | Does not write mood history |
| Reason Tags | `screens/personalization/ReasonTagsScreen.tsx` | Partially Implemented | 4–6 | Not used for therapist matching |
| Therapy Experience | `screens/personalization/TherapyExperienceScreen.tsx` | Partially Implemented | 3–5 | Local store only |
| Onboarding Complete | `screens/personalization/OnboardingCompleteScreen.tsx` | Partially Implemented | 2–4 | Completes flag → MainApp |

**Personalization subtotal:** 16–26h

---

## 4. Home

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Home | `screens/home/HomeScreen.tsx` | **Needs Redesign** | 16–24 | Close to Design `Home.png` (sessions, explore, calendar, mood chips). Spec §1.3 wants **4 feature cards** + **mood trends chart** — chart missing; mood chips don’t create logs |

**Home subtotal:** 16–24h

---

## 5. AI Companion (Chat)

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Chat | `screens/chat/ChatScreen.tsx` | **Needs Redesign** | 28–40 | Mock conversation, starters, quick replies. Gaps: Spec timestamps; crisis detection/escalation (Feature Scope / User Flow); mode switcher; Design header/mic/STT; tab labeled “Chat” not “AI Companion” |

**Chat subtotal:** 28–40h

---

## 6. Mood

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Mood Tracker | `screens/mood/MoodTrackingScreen.tsx` | Partially Implemented | 8–12 | Strong vs Design mood tracker. Gaps: Spec optional note field; daily entry limits (User Flow max 3); label “Save Log” vs “Save Mood Entry” |
| Mood History | `screens/mood/MoodHistoryScreen.tsx` | Partially Implemented | 16–24 | List only. Spec §1.10: **line chart + weekly/monthly views** missing; insights unused |

**Mood subtotal:** 24–36h

---

## 7. Therapists

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Therapist List | `screens/therapists/TherapistListScreen.tsx` | Partially Implemented | 16–24 | Search + cards work. Title “Schedule” vs Spec Therapists. **No Filter button/panel** (Spec §1.4 / User Flow). Card missing languages / next available from Spec |
| Therapist Profile | `screens/therapists/TherapistProfileScreen.tsx` | Partially Implemented | 12–18 | Bio + book CTA. Missing Spec sections: approach, languages, certifications, on-profile availability calendar |
| Therapist Filter Panel | — | **Missing** | 12–16 | Spec filters: specialization, language, price, availability |

**Therapists subtotal:** 40–58h

---

## 8. Sessions & Booking

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Booking | `screens/sessions/BookingScreen.tsx` | Partially Implemented | 14–20 | Calendar + slots + continue to pay. Gaps: grey unavailable slots; Spec confirm section; User Flow 2-min slot lock |
| Payment | `screens/sessions/PaymentScreen.tsx` | Partially Implemented | 16–24 | Design-backed fail/loading states; mock gateway only. Not in UI Spec core; Feature Scope Phase-1 booking ends at confirm |
| Booking Confirmation | `screens/sessions/BookingConfirmationScreen.tsx` | Partially Implemented | 4–8 | Design success view. No booking notification / join link (Feature Scope) |
| My Sessions | `screens/sessions/SessionsScreen.tsx` | Partially Implemented | 12–16 | Upcoming/past sections (Spec wants **tabs**). Cancel dialogs are UI-only (no store cancel). No 5-min early join rule |
| Video Session | `screens/sessions/VideoSessionScreen.tsx` | **Needs Redesign** | 40–80 | Placeholder + mic/camera toggles. **No WebRTC/Agora**, no PIP, no timer, no auto-end (Spec §1.7 / Feature Scope) |
| Session Feedback | — | **Missing** | 8–12 | User Flow §9: session end → feedback |

**Sessions subtotal:** 94–160h

---

## 9. Profile & Settings

| Screen | File | Status | Hours left | Notes |
|--------|------|--------|------------:|-------|
| Profile | `screens/profile/ProfileScreen.tsx` | **Needs Redesign** | 8–12 | Menu + Logout dialog. Spec §1.12 / Design: show photo, name, email, phone on hub — missing |
| Personal Information | `screens/profile/PersonalInformationScreen.tsx` | Partially Implemented | 10–14 | Rich form + discard dialog. Placeholder avatars; no real photo upload; account id/created date not shown |
| Email & Security | `screens/profile/EmailSecurityScreen.tsx` | Partially Implemented | 8–12 | Password/email/2FA mock; Design-aligned success dialog |
| Devices | `screens/profile/DevicesScreen.tsx` | Partially Implemented | 6–10 | Design exists; not in UI Spec core list |
| Notifications | `screens/profile/NotificationsScreen.tsx` | Partially Implemented | 12–20 | Preference toggles only. No inbox; no booking/reminder delivery |
| Billing & Invoices | `screens/profile/BillingInvoicesScreen.tsx` | Partially Implemented | 8–12 | Design-backed list; mock; not Spec Phase-1 core |
| Invoice Detail | `screens/profile/InvoiceDetailScreen.tsx` | Partially Implemented | 4–8 | Detail rows; no PDF/share |
| Care Credits | `screens/profile/CareCreditsScreen.tsx` | Partially Implemented | 8–12 | Design empty state; credits unused in Payment |
| Settings | `screens/profile/SettingsScreen.tsx` | Partially Implemented | 6–10 | Local toggles; Privacy/Terms placeholders; not synced to notification store |

**Profile subtotal:** 70–110h

---

## 10. Missing / out-of-scope (no mobile screen file)

| Item | Status | Hours | Notes |
|------|--------|------:|-------|
| Therapist Filter Panel | **Missing** | 12–16 | Counted under Therapists |
| Session Feedback | **Missing** | 8–12 | Counted under Sessions |
| Mood History charts (weekly/monthly) | **Missing** (gap on existing screen) | — | Counted under Mood History |
| AI Therapist Insight Reports (user) | **Missing** as user feature | N/A | Spec §2.5 / Feature Scope: **therapist dashboard** reports, not user tabs |
| Therapist Dashboard | Out of mobile scope | N/A (web) | UI Spec §2 |
| Admin Panel | Out of mobile scope | N/A (web) | UI Spec §3 |

---

## 11. Status rollup by screen

### Needs Redesign (5)

1. Home  
2. Chat  
3. Video Session  
4. Profile  
5. *(Video Session listed once — if counting Chat/Home/Profile/Video = 4 primary redesigns; BookingConfirmation already Design-aligned)*

Strict list: **Home, Chat, Video Session, Profile** (+ Chat Design mode UI). Therapist List is Partially Implemented but close to needing redesign for title/filter/card Spec fields.

### Partially Implemented (28)

Splash, Welcome, SignIn, ForgotPassword, SignUpBasic, OTPVerify, SetPassword, TrustedContact, all 5 personalization screens, MoodTracking, MoodHistory, TherapistList, TherapistProfile, Booking, Payment, BookingConfirmation, Sessions, PersonalInformation, EmailSecurity, Devices, Notifications, BillingInvoices, InvoiceDetail, CareCredits, Settings.

### Implemented (0)

None meet full Spec + Design + Feature Scope without remaining gaps.

### Missing (mobile) (4)

Therapist Filter Panel · Session Feedback · Mood chart views (as Spec capability) · User-facing AI Insight Report (if ever required — currently therapist-side).

---

## 12. Product Vision / PRD alignment (platform)

| Vision / PRD pillar | Mobile status |
|---------------------|---------------|
| Continuous care loop (AI → mood → insights → therapy → between-session support) | Partial: AI + mood + booking shells; **insights→therapist** not on mobile; video stub |
| Therapy marketplace | Partial: list/search/book; filters incomplete |
| Video therapy | **Not production-ready** |
| Mood tracking + longitudinal history | Partial: logging yes; visualization no |
| AI companion | Partial: chat yes; crisis/safety incomplete |
| Institutional pilot readiness | Blocked on video, real auth/OTP, notifications, filters |

---

## 13. Hours remaining (detailed)

| Area | Low | High |
|------|----:|-----:|
| Auth | 22 | 34 |
| Registration | 32 | 50 |
| Personalization | 16 | 26 |
| Home redesign | 16 | 24 |
| Chat redesign + crisis | 28 | 40 |
| Mood | 24 | 36 |
| Therapists + filters | 40 | 58 |
| Sessions + video + feedback | 94 | 160 |
| Profile cluster | 70 | 110 |
| **Total** | **342** | **538** |

### Suggested sequencing (not code — planning only)

1. **P0 Spec blockers (~120–200h):** Video Session, Therapist filters, Mood history charts, Chat crisis/timestamps, tab IA  
2. **P1 Design production pass (~80–120h):** Home, Profile hub, Chat Design fidelity, Therapist list/profile cards  
3. **P2 Auth/registration Spec parity (~50–80h):** Signup fields, phone-OTP login, password reset completion  
4. **P3 Profile/billing polish (~70–110h):** Notifications delivery, Care Credits↔Payment, Settings/privacy  

---

## 14. Per-screen checklist (quick reference)

| # | Screen | Status |
|---|--------|--------|
| 1 | Splash | Partially Implemented |
| 2 | Welcome | Partially Implemented |
| 3 | Sign In | Partially Implemented |
| 4 | Forgot Password | Partially Implemented |
| 5 | Sign Up Basic | Partially Implemented |
| 6 | OTP Verify | Partially Implemented |
| 7 | Set Password | Partially Implemented |
| 8 | Trusted Contact | Partially Implemented |
| 9 | Personal Welcome | Partially Implemented |
| 10 | Mood Check (onboarding) | Partially Implemented |
| 11 | Reason Tags | Partially Implemented |
| 12 | Therapy Experience | Partially Implemented |
| 13 | Onboarding Complete | Partially Implemented |
| 14 | Home | Needs Redesign |
| 15 | Chat (AI Companion) | Needs Redesign |
| 16 | Mood Tracker | Partially Implemented |
| 17 | Mood History | Partially Implemented |
| 18 | Therapist List | Partially Implemented |
| 19 | Therapist Profile | Partially Implemented |
| 20 | Booking | Partially Implemented |
| 21 | Payment | Partially Implemented |
| 22 | Booking Confirmation | Partially Implemented |
| 23 | My Sessions | Partially Implemented |
| 24 | Video Session | Needs Redesign |
| 25 | Profile | Needs Redesign |
| 26 | Personal Information | Partially Implemented |
| 27 | Email & Security | Partially Implemented |
| 28 | Devices | Partially Implemented |
| 29 | Notifications | Partially Implemented |
| 30 | Billing & Invoices | Partially Implemented |
| 31 | Invoice Detail | Partially Implemented |
| 32 | Care Credits | Partially Implemented |
| 33 | Settings | Partially Implemented |
| — | Therapist Filter Panel | **Missing** |
| — | Session Feedback | **Missing** |
| — | Therapist Dashboard | Out of scope (web) |
| — | Admin Panel | Out of scope (web) |

---

*Report only — no code changes made.*
