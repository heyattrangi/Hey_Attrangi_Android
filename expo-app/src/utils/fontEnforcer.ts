import React from 'react';
import { Text, TextInput, TextStyle, StyleSheet } from 'react-native';

/**
 * Global Nunito Font Enforcer for React Native Android.
 * Intercepts React Native Text and TextInput rendering and enforces
 * exact Nunito font family resolution based on weight.
 */

export function getNunitoFontVariant(fontWeight?: TextStyle['fontWeight'], fontFamily?: string): string {
  // Preserve legitimate monospace / code viewer exceptions
  if (fontFamily === 'Courier' || fontFamily === 'GeistMono') {
    return fontFamily;
  }

  // Map weight string/number to exact loaded Nunito font asset
  const weightStr = String(fontWeight || '');
  if (weightStr === '700' || weightStr === 'bold') return 'Nunito_700Bold';
  if (weightStr === '600') return 'Nunito_600SemiBold';
  if (weightStr === '500') return 'Nunito_500Medium';
  if (weightStr === '800') return 'Nunito_800ExtraBold';
  if (weightStr === '900') return 'Nunito_900Black';
  if (weightStr === '300' || weightStr === '100' || weightStr === '200') return 'Nunito_300Light';

  return 'Nunito_400Regular';
}

export function enableGlobalNunitoFont(): void {
  // 1. Configure defaultProps fallback for Text & TextInput
  if ((Text as any).defaultProps == null) {
    (Text as any).defaultProps = {};
  }
  (Text as any).defaultProps.style = { fontFamily: 'Nunito_400Regular' };

  if ((TextInput as any).defaultProps == null) {
    (TextInput as any).defaultProps = {};
  }
  (TextInput as any).defaultProps.style = { fontFamily: 'Nunito_400Regular' };

  // 2. Wrap Text.render if available to dynamically map weight -> exact Nunito font variant
  const originalTextRender = (Text as any).render;
  if (typeof originalTextRender === 'function') {
    (Text as any).render = function (...args: any[]) {
      const element = originalTextRender.apply(this, args);
      if (element && React.isValidElement(element)) {
        const flattened = StyleSheet.flatten((element.props as any)?.style) || {};
        const targetFont = getNunitoFontVariant(flattened.fontWeight, flattened.fontFamily);
        return React.cloneElement(element, {
          style: [(element.props as any)?.style, { fontFamily: targetFont }],
        } as any);
      }
      return element;
    };
  }

  // 3. Wrap TextInput.render if available
  const originalInputRender = (TextInput as any).render;
  if (typeof originalInputRender === 'function') {
    (TextInput as any).render = function (...args: any[]) {
      const element = originalInputRender.apply(this, args);
      if (element && React.isValidElement(element)) {
        const flattened = StyleSheet.flatten((element.props as any)?.style) || {};
        const targetFont = getNunitoFontVariant(flattened.fontWeight, flattened.fontFamily);
        return React.cloneElement(element, {
          style: [(element.props as any)?.style, { fontFamily: targetFont }],
        } as any);
      }
      return element;
    };
  }
}
