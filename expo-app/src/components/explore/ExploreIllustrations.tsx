import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

interface ActivityIllustrationProps {
  slug: string;
}

export const ActivityIllustration: React.FC<ActivityIllustrationProps> = ({ slug }) => {
  switch (slug) {
    case 'breathing':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Concentric Airflow Rings & Soft Waves */}
            <Circle cx={90} cy={45} r={40} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={3} />
            <Circle cx={90} cy={45} r={26} stroke="rgba(255, 255, 255, 0.6)" strokeWidth={4} />
            <Circle cx={90} cy={45} r={12} fill="rgba(255, 255, 255, 0.8)" />
            <Path
              d="M20 45 C50 20, 130 70, 160 45"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M30 55 C60 75, 120 15, 150 55"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case '5-4-3-2-1-grounding':
    case 'grounding':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* 5 Sensory Grounding Ripples & Waves */}
            <Path
              d="M 15 65 Q 45 25 90 45 T 165 25"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Circle cx={40} cy={45} r={8} fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx={65} cy={35} r={10} fill="rgba(255, 255, 255, 0.7)" />
            <Circle cx={90} cy={45} r={14} fill="rgba(255, 255, 255, 0.85)" />
            <Circle cx={115} cy={55} r={10} fill="rgba(255, 255, 255, 0.7)" />
            <Circle cx={140} cy={45} r={8} fill="rgba(255, 255, 255, 0.6)" />
          </Svg>
        </View>
      );

    case 'micro-movement':
    case 'movement':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Human Body Motion Arcs */}
            <Path
              d="M30 70 C 60 20, 120 20, 150 70"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Path
              d="M50 75 C 75 40, 105 40, 130 75"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Circle cx={90} cy={28} r={12} fill="rgba(255, 255, 255, 0.85)" />
          </Svg>
        </View>
      );

    case 'progressive-muscle-relaxation':
    case 'relaxation':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Soft Muscle Relaxation Leaf Curves */}
            <G opacity={0.65}>
              <Path
                d="M 90 85 C 50 65 30 40 40 15 C 65 25 80 50 90 85 Z"
                fill="rgba(255, 255, 255, 0.4)"
              />
              <Path
                d="M 90 85 C 130 65 150 40 140 15 C 115 25 100 50 90 85 Z"
                fill="rgba(255, 255, 255, 0.3)"
              />
              <Path
                d="M 90 85 L 90 20"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </G>
          </Svg>
        </View>
      );

    case 'journal-reflection':
    case 'journal':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Journal Notebook & Sparkle Shapes */}
            <Rect
              x={55}
              y={18}
              width={70}
              height={55}
              rx={8}
              fill="rgba(255, 255, 255, 0.45)"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={2}
            />
            <Path
              d="M 70 32 L 110 32 M 70 44 L 105 44 M 70 56 L 95 56"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M 135 22 L 138 28 L 144 31 L 138 34 L 135 40 L 132 34 L 126 31 L 132 28 Z"
              fill="rgba(255, 255, 255, 0.85)"
            />
          </Svg>
        </View>
      );

    case 'read-breathing':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Circle cx={90} cy={45} r={35} stroke="rgba(255, 255, 255, 0.45)" strokeWidth={3} />
            <Path
              d="M30 45 C60 15, 120 75, 150 45"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'read-exam':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Rect
              x={60}
              y={20}
              width={60}
              height={50}
              rx={6}
              fill="rgba(255, 255, 255, 0.35)"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={3}
            />
            <Path
              d="M 75 35 L 105 35 M 75 45 L 100 45 M 75 55 L 95 55"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'read-sleep':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path
              d="M95 20 C70 20 55 40 55 60 C55 75 65 85 80 85 C65 80 60 65 65 50 C70 35 85 25 95 20 Z"
              fill="rgba(255, 255, 255, 0.65)"
            />
            <Path
              d="M 120 30 L 122 34 L 126 36 L 122 38 L 120 42 L 118 38 L 114 36 L 118 34 Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
            <Path
              d="M 140 50 L 141 53 L 144 54 L 141 55 L 140 58 L 139 55 L 136 54 L 139 53 Z"
              fill="rgba(255, 255, 255, 0.7)"
            />
          </Svg>
        </View>
      );

    case 'read-homesick':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path
              d="M 90 20 L 50 50 L 60 50 L 60 75 L 120 75 L 120 50 L 130 50 Z"
              fill="rgba(255, 255, 255, 0.4)"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <Path
              d="M 90 42 C 85 36 75 38 75 45 C 75 52 90 60 90 60 C 90 60 105 52 105 45 C 105 38 95 36 90 42 Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
          </Svg>
        </View>
      );

    case 'read-thoughts':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path
              d="M 40 45 C 40 20, 80 20, 90 45 C 100 70, 140 70, 140 45 C 140 20, 100 20, 90 45 C 80 70, 40 70, 40 45 Z"
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'listen-calm':
    case 'calm-down':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Calming Audio Wave Rings */}
            <Circle cx={90} cy={45} r={36} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={3} />
            <Circle cx={90} cy={45} r={22} stroke="rgba(255, 255, 255, 0.6)" strokeWidth={4} />
            <Path
              d="M 25 45 C 55 15, 125 75, 155 45"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'listen-comfort':
    case 'comfort':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Warm Embrace & Soundwave */}
            <Path
              d="M 90 25 C 80 15 65 18 65 30 C 65 42 90 55 90 55 C 90 55 115 42 115 30 C 115 18 100 15 90 25 Z"
              fill="rgba(255, 255, 255, 0.45)"
            />
            <Path
              d="M 20 65 Q 90 35 160 65"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'listen-release':
    case 'emotional-release':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Soothing Equalizer Waves */}
            <Path
              d="M 30 55 C 50 25, 70 75, 90 35 C 110 75, 130 25, 150 55"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Path
              d="M 40 65 C 65 40, 115 80, 140 55"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'listen-focus':
    case 'focus':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Concentric Ambient Focus Rings */}
            <Circle cx={90} cy={45} r={38} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={2} strokeDasharray="6 6" />
            <Circle cx={90} cy={45} r={24} stroke="rgba(255, 255, 255, 0.5)" strokeWidth={3} />
            <Circle cx={90} cy={45} r={10} fill="rgba(255, 255, 255, 0.8)" />
          </Svg>
        </View>
      );

    case 'listen-ground-breathe':
    case 'ground-breathe':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path d="M 30 50 C 60 20, 120 20, 150 50" stroke="rgba(255, 255, 255, 0.6)" strokeWidth={4} strokeLinecap="round" />
            <Circle cx={90} cy={40} r={16} fill="rgba(255, 255, 255, 0.7)" />
          </Svg>
        </View>
      );

    case 'listen-lift-mood':
    case 'lift-mood':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path d="M 40 60 Q 90 10 140 60" stroke="rgba(255, 255, 255, 0.7)" strokeWidth={4} strokeLinecap="round" />
            <Circle cx={90} cy={30} r={12} fill="rgba(255, 255, 255, 0.85)" />
          </Svg>
        </View>
      );

    case 'listen-reflect':
    case 'reflect':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Circle cx={90} cy={45} r={30} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={3} />
            <Path d="M 45 45 Q 90 20 135 45 Q 90 70 45 45 Z" fill="rgba(255, 255, 255, 0.4)" />
          </Svg>
        </View>
      );

    case 'listen-sleep':
    case 'sleep-wind-down':
    case 'sleep':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path d="M 90 20 C 70 20, 65 50, 90 70 C 110 50, 105 20, 90 20 Z" fill="rgba(255, 255, 255, 0.65)" />
            <Circle cx={125} cy={35} r={4} fill="rgba(255, 255, 255, 0.8)" />
            <Circle cx={140} cy={50} r={6} fill="rgba(255, 255, 255, 0.7)" />
          </Svg>
        </View>
      );

    case 'assessment-hero':
    case 'assessment':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            {/* Self-Reflection Mind Spark Vector Shapes */}
            <Circle cx={90} cy={45} r={36} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={3} />
            <Path
              d="M 60 45 C 75 25, 105 25, 120 45 C 105 65, 75 65, 60 45 Z"
              fill="rgba(255, 255, 255, 0.45)"
            />
            <Circle cx={90} cy={45} r={12} fill="rgba(255, 255, 255, 0.85)" />
            <Path
              d="M 135 22 L 138 28 L 144 31 L 138 34 L 135 40 L 132 34 L 126 31 L 132 28 Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
          </Svg>
        </View>
      );

    case 'assessment-depression':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path
              d="M 25 55 C 55 25, 125 75, 155 45"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    case 'assessment-anxiety':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Circle cx={90} cy={45} r={32} stroke="rgba(255, 255, 255, 0.5)" strokeWidth={3} />
            <Circle cx={90} cy={45} r={18} fill="rgba(255, 255, 255, 0.75)" />
          </Svg>
        </View>
      );

    case 'assessment-adhd':
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Path
              d="M 40 45 C 40 20, 80 20, 90 45 C 100 70, 140 70, 140 45 Z"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );

    default:
      return (
        <View style={styles.container}>
          <Svg width={180} height={90} viewBox="0 0 180 90" fill="none">
            <Circle cx={90} cy={45} r={30} fill="rgba(255, 255, 255, 0.3)" />
          </Svg>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 90,
  },
});
