import { TextStyle } from 'react-native';

/**
 * Hey Attrangi — Production Global Nunito Typography Tokens
 */

export const FontFamily = {
  light: 'Nunito_300Light',
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
  sans: 'Nunito_400Regular',
  mono: 'GeistMono',
} as const;

export const Typography: Record<string, TextStyle> = {
  display1: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    lineHeight: 41.4,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heading1: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    lineHeight: 33.6,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  heading2: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    lineHeight: 27.5,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heading3: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    lineHeight: 23.4,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 25.6,
    fontWeight: '500',
  },
  bodyMedium: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '400',
  },
  caption: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    lineHeight: 18.0,
    fontWeight: '600',
  },
  microBadge: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    lineHeight: 10.0,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
};

export type TypographyVariant = keyof typeof Typography;
