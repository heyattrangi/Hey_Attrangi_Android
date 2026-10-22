import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ActivityIllustration } from '../explore/ExploreIllustrations';
import { hapticSelection } from '../../utils/haptics';

export interface ActivityCategoryCardProps {
  title: string;
  displayTitle?: string;
  duration: string;
  description: string;
  backgroundColor: string;
  illustrationSlug: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export const ActivityCategoryCard: React.FC<ActivityCategoryCardProps> = ({
  title,
  displayTitle,
  duration,
  description,
  backgroundColor,
  illustrationSlug,
  onPress,
  accessibilityLabel,
}) => {
  const handlePress = () => {
    void hapticSelection();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={handlePress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${displayTitle || title}, ${duration}, ${description}`}
    >
      <View style={styles.contentCol}>
        {/* Header Row: Title & Duration Badge */}
        <View style={styles.headerRow}>
          <Text style={styles.titleText}>{displayTitle || title}</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.descriptionText} numberOfLines={2}>
          {description}
        </Text>

        {/* Illustration Container */}
        <View style={styles.illustrationArea}>
          <ActivityIllustration slug={illustrationSlug} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 180,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    marginBottom: -55, // Stacked deck overlap
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  contentCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 28,
    letterSpacing: -0.3,
    flex: 1,
  },
  durationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 18,
    marginTop: 4,
  },
  illustrationArea: {
    marginTop: 4,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
