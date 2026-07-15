# Sprint 22 — Therapist / Admin Portal

**Scope:** Frontend architecture only (no backend)  
**Date:** 2026-07-15

## Architecture

```
domain → mocks/mockPortal.ts → IPortalService (Mock|Real)
  → portalStore → components/portal → screens/portal
  → nav / linking / Profile · Settings
  → feature flag enableTherapistPortal
```

Separate from `institution/` campus surfaces; institution remaining as campus home while portal owns clinical / admin ops UI.

## Surfaces

| Feature | Route |
|---------|-------|
| Therapist Dashboard | `TherapistDashboard` |
| Schedule | `TherapistSchedule` |
| Appointments | `TherapistAppointments` |
| Availability | `TherapistAvailability` |
| Client List | `TherapistClientList` |
| Notes placeholder | `SessionNotesPlaceholder` |
| AI Summary placeholder | `SessionAiSummaryPlaceholder` |
| Reports | `PortalReports` |
| Admin Dashboard | `AdminDashboard` |
| Institution Analytics | `InstitutionAnalytics` |

## Reusable components

- `PortalStatStrip`
- `AppointmentCard`
- `ClientListItem`
- `ScheduleSlotRow`
- `AvailabilityRow`
- `PortalPlaceholderPanel`

## Backend later

Replace `MockPortalService` with HTTP while keeping `IPortalService` — screens stay unchanged.
