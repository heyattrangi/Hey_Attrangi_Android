# Sprint 20 — Family & Trusted Circle

**Scope:** Frontend trusted contacts, caregivers, consent & sharing (no backend)  
**Date:** 2026-07-15

## Architecture

```
domain (TrustedCircleMember, permissions, sharing, consent)
  → mocks/mockFamily.ts
  → IFamilyService (Mock | Real)
  → familyStore
  → components/family/*
  → screens/family/* + upgraded Trusted/Emergency screens
  → nav / linking / Profile · Privacy
```

## Surfaces

| Feature | Route |
|---------|-------|
| Trusted Circle hub | `TrustedCircle` |
| Emergency Contacts | `EmergencyContacts` |
| Guardian View placeholder | `GuardianView` |
| Caregiver Dashboard placeholder | `CaregiverDashboard` |
| Invite Contact + consent | `InviteContact` |
| Relationship Management | `RelationshipManagement` |
| Permissions | `CirclePermissions` (+ per-member) |
| Emergency Sharing | `EmergencySharing` |
| Wellness Sharing | `WellnessSharing` |
| Consent Dialogs | `ConsentDialog` |

## Flags

- `enableTrustedCircle: true`
- `enableCaregiverDashboard: true`
- `enableParentRole: false` (Guardian View remains placeholder)

## Backend later

Swap `MockFamilyService` → HTTP; keep invite deep-link token, share push, and consent audit trail on the same `IFamilyService` contract.
