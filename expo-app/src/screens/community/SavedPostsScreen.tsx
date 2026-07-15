import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { DiscussionCardView } from '../../components/community';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'SavedPosts'>;
};

export const SavedPostsScreen: React.FC<Props> = ({ navigation }) => {
  const savedPosts = useCommunityStore((s) => s.savedPosts);
  const anonymous = useCommunityStore((s) => s.anonymous);
  const loadSavedPosts = useCommunityStore((s) => s.loadSavedPosts);
  const toggleSavePost = useCommunityStore((s) => s.toggleSavePost);

  useEffect(() => {
    void loadSavedPosts();
  }, [loadSavedPosts]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Saved Posts"
        subtitle="Discussion cards you’ve kept"
        onBack={() => navigation.goBack()}
      />
      {savedPosts.map((post) => (
        <DiscussionCardView
          key={post.id}
          post={post}
          anonymousMode={anonymous?.enabled ?? true}
          onSave={(p) => void toggleSavePost(p.id)}
          onReport={(p) =>
            navigation.navigate('ContentReport', {
              targetType: 'post',
              targetId: p.id,
              targetPreview: p.title,
            })
          }
        />
      ))}
      {!savedPosts.length ? (
        <Text style={styles.empty}>No saved posts yet.</Text>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
});
