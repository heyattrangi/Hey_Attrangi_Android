# Sprint 19 — Wellness Reports & Analytics

**Scope:** Frontend reporting experiences (no backend)  
**Date:** 2026-07-15

## Architecture

```
domain (ReportKind, WellnessReportSummary, …)
  → mocks/mockReports.ts
  → IReportsService (Mock | Real)
  → reportsStore
  → components/reports/*
  → screens/reports/*
  → nav / linking / Profile & Settings
```

## Delivered surfaces

| Experience | Route / screen |
|------------|----------------|
| Reports hub | `WellnessReportsHub` |
| Wellness dashboard + progress charts | `WellnessReportsDashboard` |
| Mood / Weekly / Monthly / Therapy / Journal / Habit / Sleep / Stress | `ReportDetail` `{ kind }` |
| Download PDF placeholder + CSV/JSON | `ReportActionsBar` + `ReportExportData` |
| Export data | `ReportExportData` |
| Share report | `Share.share` via `prepareShare` |
| Institution reports placeholder | `InstitutionReports` |
| Parent reports placeholder | `ParentReports` |

## Backend later

Swap `MockReportsService` → HTTP on the same `IReportsService` contract. Screens need no redesign.
