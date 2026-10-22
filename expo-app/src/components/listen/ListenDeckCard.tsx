import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ActivityArtwork } from '../activities/ActivityArtwork';

export interface ListenDeckCardItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  trackCount: number;
  backgroundColor: string;
  textColor?: string;
  badgeBg?: string;
  badgeText?: string;
  circleBg?: string;
}

interface ListenDeckCardProps {
  item: ListenDeckCardItem;
  index: number;
  totalCards: number;
  onPress: () => void;
  isWrappedInInteractive?: boolean;
}

export const ListenDeckCard: React.FC<ListenDeckCardProps> = ({
  item,
  index,
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
      accessibilityLabel={`${item.name}, ${item.trackCount} tracks`}
    >
      {/* Top Header Row: Title + Track Count Badge */}
      <View style={styles.headerRow}>
        <Text style={[styles.titleText, { color: item.textColor || '#1E293B' }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.trackCountBadge}>
          <Text style={styles.trackCountText}>{item.trackCount} tracks</Text>
        </View>
      </View>

      {/* Centered Low-Opacity Charcoal Circle + Cloudinary Category Artwork Group */}
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 10,
    gap: 8,
  },
  titleText: {
    fontSize: 19,
    fontWeight: '500',
    letterSpacing: -0.3,
    lineHeight: 25,
    flex: 1,
  },
  trackCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  trackCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
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
