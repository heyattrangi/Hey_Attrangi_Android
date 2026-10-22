import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  BackHandler,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { ActivityArtwork } from '../activities/ActivityArtwork';
import { Icon } from '../app/Icon';
import { ListenDeckCardItem } from './ListenDeckCard';
import { AUDIO_CATEGORIES, MusicTrack } from '../../data/musicLibrary';
import { hapticSelection } from '../../utils/haptics';

interface ListenCategoryModalProps {
  category: ListenDeckCardItem | null;
  visible: boolean;
  onClose: () => void;
}

export const ListenCategoryModal: React.FC<ListenCategoryModalProps> = ({
  category,
  visible,
  onClose,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleCloseCategoryModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleBackPress = useCallback(() => {
    if (visible) {
      handleCloseCategoryModal();
      return true;
    }
    return false;
  }, [visible, handleCloseCategoryModal]);

  useEffect(() => {
    if (visible) {
      console.log(`[LISTEN] category selected: ${category?.slug || 'calm-down'}`);
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        subscription.remove();
      };
    }
  }, [visible, category, handleBackPress]);

  if (!category || !visible) return null;

  const canonicalCat = AUDIO_CATEGORIES.find(
    (c) => c.slug === category.slug || c.id === category.id,
  );
  const tracks = canonicalCat ? canonicalCat.tracks : [];

  const handleSelectTrack = (track: MusicTrack) => {
    console.log(`[LISTEN] track selected: ${track.title}`);
    console.log(`[LISTEN] artwork URL: ${track.artworkUrl || 'N/A'}`);
    console.log(`[LISTEN] audio URL: ${track.audioUrl || 'N/A'}`);
    console.log(`[LISTEN] navigating to TrackPlayerScreen`);

    void hapticSelection();
    navigation.navigate('ListenTrackPlayer', {
      track,
      categoryName: category.name,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseCategoryModal}
    >
      <View style={styles.modalRoot}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Native Clean Back Button Header */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backCircleBtn}
              onPress={handleCloseCategoryModal}
              activeOpacity={0.8}
              accessibilityLabel="Back to Listen categories"
              accessibilityRole="button"
            >
              <Icon name="arrow-left" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Category Header: Title */}
          <View style={styles.headerTitleRow}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
          </View>

          {/* Category Description */}
          <Text style={styles.categoryDescription}>{category.description}</Text>

          {/* 2-Column Track Grid */}
          <View style={styles.gridContainer}>
            {tracks.map((track, idx) => (
              <TouchableOpacity
                key={track.id + idx}
                style={styles.gridCard}
                onPress={() => handleSelectTrack(track)}
                activeOpacity={0.88}
                accessibilityLabel={`${track.title}, ${track.duration}`}
                accessibilityRole="button"
              >
                {/* Artwork Image Container */}
                <View style={styles.artworkCardContainer}>
                  {track.artworkUrl ? (
                    <Image
                      source={{ uri: track.artworkUrl }}
                      style={styles.artworkImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.fallbackArtworkWrapper}>
                      <ActivityArtwork slug={track.artworkSlug || category.slug} size={130} />
                    </View>
                  )}
                </View>

                {/* Track Title */}
                <Text style={styles.trackTitle} numberOfLines={2}>
                  {track.title}
                </Text>

                {/* Metadata Row */}
                <View style={styles.trackMetaRow}>
                  <Text style={styles.metaText}>{track.artist}</Text>
                  <Text style={styles.metaText}>{track.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  trackCountBadge: {
    backgroundColor: '#DF7F49',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  trackCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  categoryDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 28,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    marginBottom: 24,
  },
  artworkCardContainer: {
    width: '100%',
    height: 165,
    borderRadius: 28,
    backgroundColor: '#EAE5DB',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  fallbackArtworkWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 20,
    marginTop: 10,
  },
  trackMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
});
