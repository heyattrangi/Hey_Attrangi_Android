# Hey Attrangi — Expo frontend

Frontend-only Expo app. Uses local mock data; no backend required.

## Run with Expo Go

```bash
cd expo-app
npm install
npx expo start
```

Scan the QR code with Expo Go.

## Demo tips

- Sign in with any email/phone + password
- OTP: enter any 6-digit code
- Google Sign-In uses a mock token (no native Google SDK in Expo Go)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo Go (via helper script) |
| `npm run start:tunnel` | Expo Go with tunnel |
| `npm run start:lan` | Expo Go over LAN (offline cache) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
