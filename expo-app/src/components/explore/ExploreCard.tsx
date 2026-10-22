import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { ExploreCardBadge } from './ExploreCardBadge';
import { EXPLORE_COLORS, EXPLORE_METRICS } from './ExploreTokens';

export interface ExploreCardProps {
  title: string;
  subtitle?: string;
  category?: string;
  duration?: string;
  trackCount?: string | number;
  ctaText?: string;
  backgroundColor?: string;
  textColor?: string;
  subtitleColor?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  illustration?: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  subtitle,
  category,
  duration,
  trackCount,
  backgroundColor = EXPLORE_COLORS.cardBg,
  textColor = '#1E293B',
  subtitleColor = '#475569',
  badgeBg,
  badgeTextColor,
  illustration,
  onPress,
  accessibilityLabel,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${title}${duration ? `, ${duration}` : ''}`}
    >
      {/* Top Header Row: Title on Left, Duration Badge on Right */}
      <View style={styles.topHeaderRow}>
        <View style={styles.titleCol}>
          {category ? (
            <ExploreCardBadge
              label={category}
              backgroundColor={badgeBg || 'rgba(255, 255, 255, 0.4)'}
              textColor={badgeTextColor || textColor}
              style={{ marginBottom: 4 }}
            />
          ) : null}
          <Text style={[styles.titleText, { color: textColor }]}>{title}</Text>
        </View>

        {duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        ) : trackCount !== undefined ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{trackCount} tracks</Text>
          </View>
        ) : null}
      </View>

      {/* Subtitle / Description if present */}
      {subtitle ? (
        <Text style={[styles.subtitleText, { color: subtitleColor }]} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}

      {/* Center / Lower Illustration Area */}
      {illustration ? (
        <View style={styles.illustrationArea}>{illustration}</View>
      ) : (
        <View style={{ height: 16 }} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    height: 180,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  durationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    marginTop: 4,
  },
  illustrationArea: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
