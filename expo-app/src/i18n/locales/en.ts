/**
 * English (source of truth for keys).
 * Other locales fall back to en for missing keys.
 */
const en = {
  common: {
    retry: 'Retry',
    cancel: 'Cancel',
    continue: 'Continue',
    save: 'Save',
    back: 'Back',
    loading: 'Loading',
    search: 'Search',
    settings: 'Settings',
    profile: 'Profile',
    home: 'Home',
    offline: 'You are offline',
    error: 'Something went wrong',
    comingSoon: 'Coming soon',
  },
  tabs: {
    home: 'Home',
    companion: 'Companion',
    mood: 'Mood',
    therapists: 'Therapists',
    profile: 'Profile',
    campus: 'Campus',
  },
  home: {
    upcomingSessions: 'Upcoming sessions',
    trackMood: 'Track your mood',
    progress: 'Progress',
    insights: 'Insights',
    habits: 'Habits',
  },
  appearance: {
    title: 'Appearance',
    subtitle: 'Look and feel',
    theme: 'Theme',
    fontSize: 'Font size',
    fontSmall: 'Small',
    fontDefault: 'Default',
    fontLarge: 'Large',
    fontXL: 'Extra large',
    reduceMotion: 'Reduce motion',
    highContrast: 'High contrast',
  },
  language: {
    title: 'Language',
    subtitle: 'App language',
    search: 'Search languages',
    recent: 'Recently used',
    all: 'All languages',
    rtlNote: 'Right-to-left layout support is prepared for future languages.',
  },
  a11y: {
    doubleTap: 'Double tap to activate',
    selected: 'selected',
    imageUnavailable: 'Image unavailable',
  },
  perf: {
    syncing: 'Syncing in background',
  },
} as const;

export type TranslationTree = typeof en;
export default en;
