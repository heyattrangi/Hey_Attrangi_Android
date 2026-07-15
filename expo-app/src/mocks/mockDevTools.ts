import { Colors } from '../app/design-system';
import { Typography } from '../app/design-system';
import { APP_VERSION } from '../constants/appMeta';
import { env } from '../config/env';
import {
  getEffectiveApiBaseUrl,
  getEffectiveAppEnv,
  getEffectiveUseMockServices,
} from '../config/devRuntime';
import { resolveApiMode } from '../platform/apiArchitecture';
import { DEFAULT_FEATURE_FLAGS } from '../config/featureFlags';
import type {
  DevColorSwatch,
  DevMenuItem,
  DevNetworkLogEntry,
  DevPerfMetric,
  DevShowcaseStory,
  DevToolsSnapshot,
} from '../types/domain';
import { Platform } from 'react-native';

export const MOCK_DEV_MENU: DevMenuItem[] = [
  {
    id: 'm1',
    label: 'Component Gallery',
    subtitle: 'Browse reusable UI building blocks',
    route: 'ComponentGallery',
    group: 'gallery',
  },
  {
    id: 'm2',
    label: 'Component Showcase',
    subtitle: 'Storybook-style interactive stories',
    route: 'ComponentShowcase',
    group: 'gallery',
  },
  {
    id: 'm3',
    label: 'Theme Playground',
    subtitle: 'Spacing, radius, surfaces',
    route: 'ThemePlayground',
    group: 'theme',
  },
  {
    id: 'm4',
    label: 'Typography Preview',
    subtitle: 'All type tokens',
    route: 'TypographyPreview',
    group: 'theme',
  },
  {
    id: 'm5',
    label: 'Color Palette',
    subtitle: 'Brand + semantic colors',
    route: 'ColorPalettePreview',
    group: 'theme',
  },
  {
    id: 'm6',
    label: 'Animation Preview',
    subtitle: 'Motion durations & presets',
    route: 'AnimationPreview',
    group: 'theme',
  },
  {
    id: 'm7',
    label: 'Empty State Gallery',
    subtitle: 'Empty variants',
    route: 'EmptyStateGallery',
    group: 'states',
  },
  {
    id: 'm8',
    label: 'Loading Gallery',
    subtitle: 'Loading domains',
    route: 'LoadingGallery',
    group: 'states',
  },
  {
    id: 'm9',
    label: 'Dialog Gallery',
    subtitle: 'Design dialogs',
    route: 'DialogGallery',
    group: 'states',
  },
  {
    id: 'm10',
    label: 'UI States (QA)',
    subtitle: 'Combined state host demo',
    route: 'UiStatesDemo',
    group: 'states',
  },
  {
    id: 'm11',
    label: 'Feature Toggles',
    subtitle: 'Runtime feature flags',
    route: 'FeatureToggle',
    group: 'runtime',
  },
  {
    id: 'm12',
    label: 'Mock API Switch',
    subtitle: 'Mock vs Real services',
    route: 'MockApiSwitch',
    group: 'runtime',
  },
  {
    id: 'm13',
    label: 'Environment Switch',
    subtitle: 'Preferred API environment',
    route: 'EnvironmentSwitch',
    group: 'runtime',
  },
  {
    id: 'm14',
    label: 'Debug Screen',
    subtitle: 'Build & runtime info',
    route: 'DebugScreen',
    group: 'debug',
  },
  {
    id: 'm15',
    label: 'Performance Monitor',
    subtitle: 'Lightweight metrics',
    route: 'PerformanceMonitor',
    group: 'debug',
  },
  {
    id: 'm16',
    label: 'Network Inspector',
    subtitle: 'Placeholder request log',
    route: 'NetworkInspector',
    group: 'debug',
  },
];

export const MOCK_SHOWCASE_STORIES: DevShowcaseStory[] = [
  {
    id: 's-card',
    title: 'AppCard',
    category: 'Surfaces',
    description: 'Primary content surface with optional press.',
  },
  {
    id: 's-header',
    title: 'AppHeader',
    category: 'Navigation',
    description: 'Back + title + subtitle pattern.',
  },
  {
    id: 's-empty',
    title: 'EmptyState',
    category: 'States',
    description: 'Calm empty canvas for lists and hubs.',
  },
  {
    id: 's-loading',
    title: 'LoadingState',
    category: 'States',
    description: 'Domain-aware loading messages.',
  },
  {
    id: 's-chip',
    title: 'Selection chips',
    category: 'Controls',
    description: 'Pill chips used across galleries and hubs.',
  },
];

const COLOR_GROUPS: Array<{ group: string; keys: Array<keyof typeof Colors> }> = [
  {
    group: 'Brand',
    keys: ['primary', 'primaryDark', 'primaryLight', 'primaryGlow'],
  },
  {
    group: 'Text',
    keys: ['textPrimary', 'textSecondary', 'textMuted', 'textAccent'],
  },
  {
    group: 'Surfaces',
    keys: ['background', 'surface', 'peachLight', 'peachMuted'],
  },
  {
    group: 'Semantic',
    keys: ['success', 'warning', 'error', 'info'],
  },
];

export function buildColorSwatches(): DevColorSwatch[] {
  return COLOR_GROUPS.flatMap((g) =>
    g.keys.map((token) => ({
      token,
      hex: String(Colors[token]),
      group: g.group,
    })),
  );
}

export const MOCK_NETWORK_LOGS: DevNetworkLogEntry[] = [
  {
    id: 'n1',
    method: 'GET',
    path: '/portal/snapshot',
    status: 'mock',
    durationMs: 312,
    at: new Date().toISOString(),
    source: 'mock',
  },
  {
    id: 'n2',
    method: 'GET',
    path: '/community/spaces',
    status: 'mock',
    durationMs: 240,
    at: new Date().toISOString(),
    source: 'mock',
  },
  {
    id: 'n3',
    method: 'POST',
    path: '/auth/refresh',
    status: 200,
    durationMs: 88,
    at: new Date().toISOString(),
    source: 'placeholder',
  },
];

export function buildPerfMetrics(tick = 0): DevPerfMetric[] {
  const fps = 58 + (tick % 4);
  return [
    {
      id: 'p1',
      label: 'Estimated FPS',
      value: String(fps),
      hint: 'Heuristic · not Instruments',
      status: fps >= 55 ? 'ok' : 'warn',
    },
    {
      id: 'p2',
      label: 'JS timer lag',
      value: `${8 + (tick % 5)} ms`,
      hint: 'setInterval drift sample',
      status: 'info',
    },
    {
      id: 'p3',
      label: 'Bridge',
      value: 'stable',
      hint: 'Placeholder until Flipper/devtools bridge',
      status: 'ok',
    },
    {
      id: 'p4',
      label: 'Memory hint',
      value: `${42 + (tick % 7)} MB`,
      hint: 'Mock RSS · not hermes heap',
      status: 'info',
    },
  ];
}

export function buildDebugInfo(flagsEnabledCount: number): DevToolsSnapshot['debug'] {
  const useMock = getEffectiveUseMockServices();
  return {
    appVersion: APP_VERSION,
    bundleIdHint: 'com.heyattrangi.app',
    jsEngineHint: 'Hermes (assumed)',
    platform: `${Platform.OS} ${String(Platform.Version)}`,
    isDev: Boolean(__DEV__),
    apiMode: resolveApiMode(useMock),
    envCurrent: getEffectiveAppEnv(),
    apiBaseUrl: getEffectiveApiBaseUrl(),
    flagsEnabledCount,
    flagsTotal: Object.keys(DEFAULT_FEATURE_FLAGS).length,
  };
}

export function buildDevToolsSnapshot(
  flagsEnabledCount: number,
): DevToolsSnapshot {
  return {
    menu: MOCK_DEV_MENU.map((m) => ({ ...m })),
    stories: MOCK_SHOWCASE_STORIES.map((s) => ({ ...s })),
    colorSwatches: buildColorSwatches(),
    typographyKeys: Object.keys(Typography),
    networkLogs: MOCK_NETWORK_LOGS.map((n) => ({ ...n })),
    perfMetrics: buildPerfMetrics(0),
    debug: buildDebugInfo(flagsEnabledCount),
    mockApiEnabled: getEffectiveUseMockServices(),
    preferredEnv: getEffectiveAppEnv(),
    networkInspectorReady: false,
    networkInspectorMessage:
      'Wire an interceptor tap into MockHttpAdapter / FetchHttpClient when backend lands. This list is placeholder traffic.',
  };
}
