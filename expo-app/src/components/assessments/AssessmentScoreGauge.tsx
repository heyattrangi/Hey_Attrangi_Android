import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

import { getScreenerMaxScore } from '../../utils/scoreAssessment';

interface AssessmentScoreGaugeProps {
  score: number;
  maxScore?: number;
  status?: string;
  severityColor?: string;
  screenerId?: string;
}

export const AssessmentScoreGauge: React.FC<AssessmentScoreGaugeProps> = ({
  score,
  maxScore,
  status,
  severityColor,
  screenerId,
}) => {
  // Determine effective maxScore dynamically if not explicitly passed
  const effectiveMaxScore =
    maxScore && maxScore > 0
      ? maxScore
      : getScreenerMaxScore(screenerId || '', undefined);

  const rawRatio = effectiveMaxScore > 0 ? score / effectiveMaxScore : 0;
  const ratio = Math.min(1, Math.max(0.02, rawRatio));

  // Gauge Dimensions
  const width = 220;
  const height = 120;
  const cx = 110;
  const cy = 100;
  const r = 75;

  // Background Arc (180deg to 0deg)
  const trackPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Progress Arc End Angle in radians (180deg is PI, 0deg is 0)
  const angle = Math.PI * (1 - ratio);
  const endX = cx + r * Math.cos(angle);
  const endY = cy - r * Math.sin(angle);

  // Determine gauge progress color based on ratio or explicit severityColor
  const defaultGaugeColor =
    ratio >= 0.75
      ? '#DC2626'
      : ratio >= 0.4
        ? '#EA580C'
        : '#F97316';

  const strokeColor = severityColor || defaultGaugeColor;

  const progressPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${endX} ${endY}`;

  return (
    <View style={styles.container}>
      {/* Semicircular SVG Arc */}
      <View style={styles.svgWrapper}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background Track */}
          <Path
            d={trackPath}
            stroke="#F1F5F9"
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
          />
          {/* Active Progress Arc */}
          <Path
            d={progressPath}
            stroke={strokeColor}
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
          />
          {/* Indicator Knob */}
          <Circle
            cx={endX}
            cy={endY}
            r={8}
            fill="#FFFFFF"
            stroke={strokeColor}
            strokeWidth={3.5}
          />
        </Svg>

        {/* Numeric Score Centered inside Arc */}
        <View style={styles.scoreCenterContent}>
          <Text style={styles.scoreNumberText}>{score}</Text>
          <Text style={styles.maxScoreLabel}>
            / {effectiveMaxScore}
          </Text>
        </View>
      </View>

      {/* Result Status / Severity Label below Gauge */}
      {status ? (
        <Text style={[styles.statusText, { color: strokeColor }]}>
          {status}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  svgWrapper: {
    width: 220,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCenterContent: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumberText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 46,
    letterSpacing: -1,
  },
  maxScoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: -2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
  },
});
