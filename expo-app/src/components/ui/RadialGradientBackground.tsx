import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import {
  RadialGradients,
  RadialGradientPreset,
} from '../../app/design-system/Gradients';

const { width, height } = Dimensions.get('window');

interface RadialGradientBackgroundProps {
  preset?: RadialGradientPreset;
}

export const RadialGradientBackground: React.FC<RadialGradientBackgroundProps> = ({
  preset = 'topRightWarm',
}) => {
  const config = RadialGradients[preset];

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id={config.id}
            cx={config.cx}
            cy={config.cy}
            rx={config.rx}
            ry={config.ry}
          >
            {config.stops.map((stop) => (
              <Stop
                key={stop.offset}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill={`url(#${config.id})`} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
});
