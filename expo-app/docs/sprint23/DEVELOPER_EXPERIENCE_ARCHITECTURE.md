# Sprint 23 — Developer Experience

**Scope:** Maintainability DX surfaces (frontend only)  
**Date:** 2026-07-15

## Architecture

```
domain → mocks/mockDevTools.ts → IDevToolsService (Mock|Real)
  → config/devRuntime.ts (mock / env overrides)
  → container.shouldUseMock* reads overrides
  → devToolsStore → components/devtools → screens/devtools
  → nav / linking / Profile · Settings
  → flag enableDevTools (__DEV__)
```

## Surfaces

| Feature | Route |
|---------|-------|
| Developer Menu | `DevToolsMenu` |
| Component Gallery | `ComponentGallery` |
| Storybook-style Showcase | `ComponentShowcase` |
| Theme Playground | `ThemePlayground` |
| Typography Preview | `TypographyPreview` |
| Color Palette Preview | `ColorPalettePreview` |
| Animation Preview | `AnimationPreview` |
| Empty State Gallery | `EmptyStateGallery` |
| Loading Gallery | `LoadingGallery` |
| Dialog Gallery | `DialogGallery` |
| Feature Toggle Screen | `FeatureToggle` |
| Mock API Switch | `MockApiSwitch` |
| Environment Switch | `EnvironmentSwitch` |
| Debug Screen | `DebugScreen` |
| Performance Monitor | `PerformanceMonitor` |
| Network Inspector (placeholder) | `NetworkInspector` |
| UI States QA (existing) | `UiStatesDemo` |

## Runtime notes

- **Mock API Switch** persists override via `devToolsStore` → `devRuntime.setMockServicesOverride` → DI `pickAuth` / `pickNonAuth`.
- **Environment Switch** stores preferred env for effective URL readout + `resetHttpClient()`.
- **Feature Toggle** writes `appConfigStore` flags (already persisted).
- **Network Inspector** ships placeholder logs until HttpClient tap hooks exist.

## Backend later

Real perf / network capture can replace mock metrics without changing screens.
