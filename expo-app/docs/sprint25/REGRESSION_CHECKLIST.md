# REGRESSION_CHECKLIST — 1.0.0 RC

Mark each item on a physical device or simulator. Block Release if any **Blocker** fails.

## Blockers
- [ ] Cold start shows splash → Welcome / Home without crash  
- [ ] Sign in / mock auth completes  
- [ ] Bottom tabs: Home · Chat · Mood · Therapists · Profile all open  
- [ ] Companion: send message, receive AI reply (mock)  
- [ ] Mood: select mood and save  
- [ ] Therapist: open list → profile → start booking shell  
- [ ] Profile: Design core 5 rows navigate  
- [ ] Privacy & Terms articles open; external URL CTA does not crash  
- [ ] No redbox / fatal on critical paths  

## Critical paths
### Auth / onboarding
- [ ] Splash brand = **Hey Attrangi**  
- [ ] Welcome → Sign In → (optional) Registration → onboarding stack  

### Home
- [ ] Greeting + upcoming empty/card  
- [ ] Explore: **2** cards only (therapists + Pragya)  
- [ ] Daily check-in opens mood  
- [ ] Mood chips selectable  

### Chat
- [ ] Header “Just listen”  
- [ ] Composer pill + mic (empty) / send (with text)  
- [ ] Keyboard does not cover input  

### Booking / pay
- [ ] Slot selection UI loads  
- [ ] Payment shell confirms with mock  

### Resilience
- [ ] Airplane mode: offline banner/queued UX behaves  
- [ ] Kill/relaunch restores session if mocked auth persisted  

## Non-blockers / known
- [ ] Video Join remains limited (expected)  
- [ ] DevTools only when `enableDevTools`  

**Sign-off:** _____________ Date: _______ Build: 1.0.0 (1)
