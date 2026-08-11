import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { Gradients, GradientPreset, LinearGradientDef } from '../tokens/gradients';

interface GradientViewProps {
  preset?: GradientPreset;
  customGradient?: LinearGradientDef;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientView: React.FC<GradientViewProps> = ({
  preset = 'primaryCta',
  customGradient,
  style,
  children,
}) => {
  const gradient = customGradient || Gradients[preset] || Gradients.primaryCta;
  const gradientId = `grad_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <View style={[styles.container, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <SvgLinearGradient
            id={gradientId}
            x1={`${gradient.start.x * 100}%`}
            y1={`${gradient.start.y * 100}%`}
            x2={`${gradient.end.x * 100}%`}
            y2={`${gradient.end.y * 100}%`}
          >
            {gradient.colors.map((color, index) => {
              const offset =
                gradient.colors.length > 1
                  ? index / (gradient.colors.length - 1)
                  : 0;
              return <Stop key={index} offset={offset} stopColor={color} stopOpacity={1} />;
            })}
          </SvgLinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
