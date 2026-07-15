import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { DiscussionCardView } from '../../components/community';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PeerDiscussions'>;
};

export const PeerDiscussionsScreen: React.FC<Props> = ({ navigation }) => {
  const discussions = useCommunityStore((s) => s.discussions);
  const anonymous = useCommunityStore((s) => s.anonymous);
  const loadSnapshot = useCommunityStore((s) => s.loadSnapshot);
  const toggleSavePost = useCommunityStore((s) => s.toggleSavePost);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Peer Discussions"
        subtitle="Discussion cards"
        onBack={() => navigation.goBack()}
      />
      {discussions.map((post) => (
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
      {!discussions.length ? (
        <Text style={styles.empty}>No discussions yet.</Text>
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
