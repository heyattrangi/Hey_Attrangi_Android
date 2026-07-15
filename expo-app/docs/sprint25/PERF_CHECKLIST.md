# PERF_CHECKLIST — 1.0.0 RC

Based on `docs/sprint17/PERFORMANCE_REPORT.md`.

## Target devices
- [ ] Mid-tier Android (≤4GB RAM)  
- [ ] Recent iPhone  
- [ ] Low-end Android (if available)  

## Metrics (manual / Instruments)
- [ ] Cold start to interactive Home < 4s on mid-tier (Expo Go / preview binary)  
- [ ] Chat scroll 50+ messages without sustained < 45 FPS  
- [ ] Home scroll with sections no multi-second white screen  
- [ ] Image reuse via `AppImage` / expo-image — no decode storms on therapist rail  
- [ ] Memory: 10 min Chat session no OOM  

## Release profile
- [ ] Preview/beta binary (not only Expo Go) measured once  
- [ ] Reduce Motion disables decorative springs  

## DevTools
Optional: open **Performance Monitor** (`PerformanceMonitor` screen) for heuristic ticks — not a substitute for Instruments.

**Sign-off:** _____________
