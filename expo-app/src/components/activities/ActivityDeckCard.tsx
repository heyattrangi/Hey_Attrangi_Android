import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ActivityArtwork } from './ActivityArtwork';

export interface ActivityDeckCardItem {
  id: string;
  slug: string;
  title: string;
  duration: string;
  backgroundColor: string;
  textColor?: string;
  badgeBg?: string;
  badgeText?: string;
  circleBg?: string;
}

interface ActivityDeckCardProps {
  item: ActivityDeckCardItem;
  index: number;
  totalCards: number;
  onPress: () => void;
  isWrappedInInteractive?: boolean;
}

export const ActivityDeckCard: React.FC<ActivityDeckCardProps> = ({
  item,
  index,
  totalCards,
  onPress,
  isWrappedInInteractive = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: item.backgroundColor,
          zIndex: isWrappedInInteractive ? undefined : index + 1,
          elevation: isWrappedInInteractive ? undefined : index + 1,
          marginTop: isWrappedInInteractive ? 0 : index === 0 ? 0 : -50,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.duration}`}
    >
      {/* Top Header Row: Title + Duration Badge */}
      <View style={styles.headerRow}>
        <Text style={[styles.titleText, { color: item.textColor || '#1E293B' }]}>
          {item.title}
        </Text>
        <View
          style={[
            styles.durationBadge,
            { backgroundColor: item.badgeBg || 'rgba(255, 255, 255, 0.4)' },
          ]}
        >
          <Text style={[styles.durationText, { color: item.badgeText || '#1E293B' }]}>
            {item.duration}
          </Text>
        </View>
      </View>

      {/* Centered Low-Opacity Charcoal Circle + Cloudinary Illustration Group */}
      <View style={styles.illustrationGroupWrapper} pointerEvents="none">
        <View style={styles.circleBackground} />
        <View style={styles.artworkWrapper}>
          <ActivityArtwork slug={item.slug} size={135} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 200, // Compact height (~15% reduction from 250dp -> 200dp)
    width: '100%',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 8,
  },
  durationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  illustrationGroupWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  circleBackground: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Subtle low-opacity dark grey/charcoal overlay token
    bottom: -35, // Positioned slightly lower behind the artwork
  },
  artworkWrapper: {
    zIndex: 2,
    paddingBottom: 15,
  },
});
