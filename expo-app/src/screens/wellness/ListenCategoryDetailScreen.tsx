import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { ActivityArtwork } from '../../components/activities/ActivityArtwork';
import { Icon } from '../../components/app/Icon';
import { ListenDeckCardItem } from '../../components/listen/ListenDeckCard';
import { AUDIO_CATEGORIES, MusicTrack } from '../../data/musicLibrary';
import { hapticSelection } from '../../utils/haptics';

type RouteProps = RouteProp<MainStackParamList, 'ListenCategoryDetail'>;
type NavProps = NativeStackNavigationProp<MainStackParamList>;

export const ListenCategoryDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const category = route.params?.category;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [handleBack]);

  if (!category) return null;

  const canonicalCat = AUDIO_CATEGORIES.find(
    (c) => c.slug === category.slug || c.id === category.id,
  );
  const tracks = canonicalCat ? canonicalCat.tracks : [];

  const handleSelectTrack = (track: MusicTrack) => {
    void hapticSelection();
    navigation.navigate('ListenTrackPlayer', {
      track,
      categoryName: category.name,
    });
  };

  return (
    <View style={styles.screenRoot}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <Icon name="arrow-left" size={18} color="#4A4A4A" />
          <Text style={styles.backText}>Back to Listen</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryDesc}>{category.description}</Text>

          <View style={styles.metadataRow}>
            <View style={styles.trackCountPill}>
              <Icon name="music" size={13} color="#6B6B6B" />
              <Text style={styles.trackCountText}>{tracks.length} Tracks</Text>
            </View>
          </View>

          <View style={styles.dividerLine} />
        </View>

        {/* Tracks List */}
        <View style={styles.tracksContainer}>
          {tracks.map((track, idx) => (
            <TouchableOpacity
              key={track.id || idx}
              style={styles.trackRow}
              onPress={() => handleSelectTrack(track)}
              activeOpacity={0.8}
            >
              <View style={styles.artworkWrapper}>
                {track.artworkUrl ? (
                  <Image source={{ uri: track.artworkUrl }} style={styles.artworkImg} />
                ) : (
                  <ActivityArtwork
                    slug={category.slug || 'calm-down'}
                    size={48}
                  />
                )}
              </View>

              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.trackSubtitle} numberOfLines={1}>
                  {track.artist || 'Attrangi Audio'} • {track.duration || '3:30'}
                </Text>
              </View>

              <View style={styles.playIconCircle}>
                <Icon name="play" size={14} color="#E26843" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 12,
    backgroundColor: '#FAF8F5',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 50,
  },
  headerBlock: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  categoryDesc: {
    fontSize: 15,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  trackCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  tracksContainer: {
    gap: 12,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  artworkWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  artworkImg: {
    width: '100%',
    height: '100%',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  trackSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  playIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
