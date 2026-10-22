import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ActivityArtwork } from '../activities/ActivityArtwork';
import { Icon } from '../app/Icon';

export interface ReadDeckCardItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  content: string;
  backgroundColor: string;
  circleBg?: string;
}

interface ReadDeckCardProps {
  item: ReadDeckCardItem;
  index: number;
  totalCards: number;
  onPress: () => void;
  isWrappedInInteractive?: boolean;
}

export const ReadDeckCard: React.FC<ReadDeckCardProps> = ({
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
      accessibilityLabel={`${item.title}, ${item.readTime}`}
    >
      {/* Top Header Row: Clean Title + Small Metadata (book icon + time) */}
      <View style={styles.headerRow}>
        <Text style={styles.titleText} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.readTimeBadge}>
          <Icon name="book-open" size={13} color="#475569" />
          <Text style={styles.readTimeText}>{item.readTime.replace(' read', '')}</Text>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 10,
    gap: 8,
  },
  titleText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#1E293B',
    letterSpacing: -0.3,
    lineHeight: 25,
    flex: 1,
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  readTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
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
