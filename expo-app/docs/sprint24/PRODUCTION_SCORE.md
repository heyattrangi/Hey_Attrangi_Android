# PRODUCTION_SCORE.md — Sprint 24

**Date:** 15 July 2026  
**Product:** Hey Attrangi Expo app (`expo-app`)  
**Purpose:** Single scorecard for production visual readiness after Pixel Perfect QA.

---

## Headline scores

| Dimension | Score | Band | Notes |
|-----------|------:|------|-------|
| **Design fidelity (Design-backed)** | **74** | C+ | Up from ~62 (Sprint 15) |
| **Overall Design compliance (weighted)** | **68** | C | Up from 52 |
| **Design system / tokens** | **88** | B+ | Chrome + SelectionCard + shadows |
| **Accessibility baseline** | **82** | B | Sprint 17 foundation + header/composer targets |
| **Keyboard / forms** | **80** | B | AppScreen KAV + Chat |
| **Responsive / device** | **76** | C+ | Layout hooks exist; uneven adoption |
| **Motion / gradients** | **84** | B | Motion presets + warm gradient |
| **Icons consistency** | **80** | B | Design Profile intentionally text-only |
| **Production visual readiness** | **71** | C+ | Ship for soft launch UI QA — not pixel-locked |

### Composite production score

**71 / 100** (visual only)

Formula:  
`0.30×fidelity + 0.20×tokens + 0.15×a11y + 0.10×keyboard + 0.10×responsive + 0.10×motion + 0.05×icons`

---

## Go / no-go by surface

| Surface | Go? | Condition |
|---------|-----|-----------|
| Auth + onboarding | **Conditional Go** | Token pass done; still measure 1–11.png margins |
| Home | **Conditional Go** | Design Explore/check-in OK; enrichment below fold OK for beta |
| Chat / Companion | **Conditional Go** | Shell matches Design; intelligence rails remain product extras |
| Profile core | **Conditional Go** | Design 5-row present; hub extras OK for power users |
| Therapists / Booking / Pay | **Conditional Go** | Usable; not pixel-locked |
| Mood tracker | **Conditional Go** | Closest mood Design |
| Video session | **No-Go** | Needs Design + real UI |
| Journal / Wellness / Family / Community / Portal / Reports / DevTools | **DS Go** | No Design PNG — ship as design-system surfaces |

---

## Risk register (visual)

| Risk | Severity | Mitigation |
|------|----------|------------|
| 148 screens vs 27 Design PNGs → false “complete” perception | High | Score Design-backed separately (this doc) |
| Profile hub still denser than Design | Medium | Design core list first; extras sectioned |
| Chat product features diverge from sparse Design | Medium | Keep Design header/composer; hide advanced rails when empty |
| No formal Spec/Flow in repo | Medium | Request docs; do not block Design PNG work |
| Video placeholder in production path | High | Gate Join → WaitingRoom until Design lands |

---

## Quality gates checklist

- [x] Canonical tokens in `app/design-system`
- [x] App chrome on design-system
- [x] Design Home Explore = 2 cards
- [x] Design Chat title / mic composer
- [x] Design Profile core list
- [x] SelectionCard / Google brand tokens
- [ ] Pixel measure pass logged against PNG devices
- [ ] Video Design delivered
- [ ] Legacy `theme/` imports eliminated
- [ ] UI Spec + User Flow checked into `docs/`

---

## Recommended next sprint (visual)

1. Device photo QA vs `Home.png` / `Chat screen.png` / `Profile.png`  
2. Therapist list + Payment density pass  
3. Video Design intake  
4. `theme/` → `design-system` codemod  
5. Tablet `ResponsiveContent` adoption on top 10 screens  

---

## Links

- `docs/sprint24/UI_AUDIT.md`  
- `docs/sprint24/DESIGN_COMPLIANCE.md`  
- Prior: `docs/UI_AUDIT_REPORT.md`, `docs/DESIGN_COMPLIANCE_REPORT.md`, `docs/PRODUCTION_READINESS_REPORT.md`  
- Design SoT: `HeyAatrangi/designs/`
