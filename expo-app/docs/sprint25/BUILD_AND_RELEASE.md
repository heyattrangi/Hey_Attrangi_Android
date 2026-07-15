# BUILD_AND_RELEASE — Production / Internal / Beta

## Prerequisites
- Node ≥ 20.19 (recommended)  
- Expo account + `npm i -g eas-cli`  
- Replace `extra.eas.projectId` in `app.json` after `eas init`  
- Apple Developer + Google Play access for store submit  

## Profiles (`eas.json`)

| Profile | Distribution | Mock APIs | Intent |
|---------|--------------|-----------|--------|
| `development` | Internal / simulator | on | Dev client |
| `preview` | Internal | on | QA / internal testing |
| `beta` | Store (TestFlight / Play internal) | **off** | Closed beta |
| `production` | Store | **off** | Public release |

## Commands

```bash
# Typecheck
npm run typecheck

# Local Expo Go (mock)
npm start

# Internal APK / internal distribution
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Closed beta
eas build --profile beta --platform all

# Production candidate
eas build --profile production --platform all

# Submit (after binary success)
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

## Environment switches
| Var | Purpose |
|-----|---------|
| `EXPO_PUBLIC_APP_ENV` | `mock` / `development` / `staging` / `production` |
| `EXPO_PUBLIC_USE_MOCK` | `false` for beta/production |
| `EXPO_PUBLIC_PRIVACY_URL` | Hosted privacy |
| `EXPO_PUBLIC_TERMS_URL` | Hosted terms |
| `EXPO_PUBLIC_RELEASE_CHANNEL` | `rc` / `internal` / `beta` / `production` |

## Native splash
Configured in `app.json` (`splash` + `expo-splash-screen` plugin). Background `#FFF8F0`.

## Version bump recipe
1. Bump `version` in `app.json` + `package.json`  
2. Bump `APP_VERSION` / `APP_BUILD` in `src/constants/appMeta.ts` and `release.ts`  
3. iOS: increment `ios.buildNumber`  
4. Android: increment `android.versionCode` (or rely on `autoIncrement` in production profile)  
5. Update `CHANGELOG.md` + `store/metadata/en-US/release_notes.txt`
