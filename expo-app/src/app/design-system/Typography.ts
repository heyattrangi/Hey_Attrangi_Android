import { TextStyle } from 'react-native';

/**
 * Hey Attrangi — Production Typography
 * Plus Jakarta Sans — premium sans matching onboarding / product screens.
 */

export const FontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const FontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 22,
  display: 24,
  hero: 28,
} as const;

export const LineHeight = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 28,
  xxl: 30,
  display: 32,
  hero: 36,
} as const;

export const Typography: Record<string, TextStyle> = {
  display: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.hero,
    fontWeight: '700',
    lineHeight: LineHeight.hero,
    letterSpacing: -0.3,
  },

  heading: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    fontWeight: '700',
    lineHeight: LineHeight.display,
    letterSpacing: -0.2,
  },

  heading1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    fontWeight: '700',
    lineHeight: LineHeight.display,
    letterSpacing: -0.2,
  },

  heading2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    lineHeight: LineHeight.xxl,
    letterSpacing: -0.2,
  },

  heading3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    fontWeight: '600',
    lineHeight: LineHeight.xl,
  },

  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    fontWeight: '600',
    lineHeight: LineHeight.lg,
    letterSpacing: 0.1,
  },

  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    fontWeight: '400',
    lineHeight: LineHeight.md,
    letterSpacing: 0,
  },

  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    fontWeight: '400',
    lineHeight: LineHeight.xs,
    letterSpacing: 0,
  },

  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    fontWeight: '400',
    lineHeight: LineHeight.md,
    letterSpacing: 0,
  },

  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: LineHeight.sm,
  },

  link: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: LineHeight.md,
  },

  buttonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    fontWeight: '600',
    lineHeight: LineHeight.lg,
  },

  accentHeading: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    fontWeight: '600',
    lineHeight: 24,
  },

  optionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: LineHeight.md,
  },

  optionSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    fontWeight: '400',
    lineHeight: LineHeight.sm,
  },
};
