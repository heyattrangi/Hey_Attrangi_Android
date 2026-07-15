# Store marketing assets — Hey Attrangi 1.0.0 RC

Place final design exports here before App Store / Play submission.

## Status

| Asset | Status |
|-------|--------|
| App icon (`../assets/icon.png`) | Present — replace with final brand mark before public launch |
| Adaptive icons | Present under `../assets/android-icon-*.png` |
| Splash | Wired to `../assets/splash-icon.png` + `#FFF8F0` |
| Screenshots | **Placeholders only** — drop PNGs into folders below |
| Feature graphic | **Missing** — add `android/feature-graphic/feature.png` |
| Legal / listing copy | Drafts in `metadata/en-US/` |

## Required sizes

### iOS screenshots
| Folder | Typical size |
|--------|--------------|
| `ios/screenshots/6.7/` | 1290 × 2796 (iPhone 15 Pro Max class) |
| `ios/screenshots/6.1/` | 1179 × 2556 (iPhone 15 / 14 class) |

Ship 3–8 shots covering: Home, Chat, Mood, Therapist booking, Profile.

### Android
| Asset | Size |
|-------|------|
| `android/screenshots/phone/` | 1080 × 2400 (or store-accepted phone) |
| `android/feature-graphic/feature.png` | **1024 × 500** |
| `android/icon/play-icon-512.png` | **512 × 512** (can mirror app icon) |

## Branding notes
- Background warmth: `#FFF8F0` / design-system `Colors.background`
- Primary accent: `#F5A623`
- Product name: **Hey Attrangi** (never bare “Aatrangi” on store)

## Workflow
1. Design team exports from Figma → drop into folders above.
2. QA compares against `docs/sprint24/DESIGN_COMPLIANCE.md`.
3. Update `metadata/en-US/*` with final legal-approved copy.
4. Attach to ASC / Play Console during submit (`eas submit`).
