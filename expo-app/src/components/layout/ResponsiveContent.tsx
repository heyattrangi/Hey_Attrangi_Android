import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { Spacing } from '../../app/design-system';

export interface ResponsiveScreenPadProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Horizontal padding + optional max width for tablets.
 * Safe-area is owned by AppScreen; this only handles width buckets.
 */
export const ResponsiveContent = memo<ResponsiveScreenPadProps>(
  ({ children, style }) => {
    const { contentPadding, maxContentWidth, isTablet } = useResponsiveLayout();
    return (
      <View
        style={[
          styles.wrap,
          {
            paddingHorizontal: contentPadding,
            maxWidth: maxContentWidth,
            alignSelf: isTablet ? 'center' : 'stretch',
            width: '100%',
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  },
);

ResponsiveContent.displayName = 'ResponsiveContent';

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
  },
  spacer: {
    height: Spacing.md,
  },
});
