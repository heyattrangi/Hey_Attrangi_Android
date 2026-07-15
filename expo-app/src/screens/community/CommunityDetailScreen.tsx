import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  DiscussionCardView,
  EventCard,
} from '../../components/community';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CommunityDetail'>;
  route: RouteProp<MainStackParamList, 'CommunityDetail'>;
};

export const CommunityDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { communityId } = route.params;
  const spaces = useCommunityStore((s) => s.spaces);
  const groups = useCommunityStore((s) => s.groups);
  const events = useCommunityStore((s) => s.events);
  const discussions = useCommunityStore((s) => s.discussions);
  const anonymous = useCommunityStore((s) => s.anonymous);
  const loadSnapshot = useCommunityStore((s) => s.loadSnapshot);
  const joinCommunity = useCommunityStore((s) => s.joinCommunity);
  const leaveCommunity = useCommunityStore((s) => s.leaveCommunity);
  const toggleSavePost = useCommunityStore((s) => s.toggleSavePost);
  const setEventAttendance = useCommunityStore((s) => s.setEventAttendance);

  useEffect(() => {
    if (!spaces.length) void loadSnapshot();
  }, [loadSnapshot, spaces.length]);

  const space = useMemo(
    () => spaces.find((s) => s.id === communityId),
    [communityId, spaces],
  );

  if (!space) {
    return (
      <AppScreen includeBottomInset gradient="topRightWarm">
        <AppHeader title="Community" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Community not found.</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title={space.name}
        subtitle={space.visibility.replace('_', ' ')}
        onBack={() => navigation.goBack()}
      />
      <AppCard style={styles.card}>
        <Text style={styles.body} maxFontSizeMultiplier={1.35}>
          {space.description}
        </Text>
        <Text style={styles.meta}>
          {space.memberCount} members · {space.topicTags.join(', ')}
        </Text>
        <PrimaryButton
          label={space.joined ? 'Leave community' : 'Join community'}
          variant={space.joined ? 'outline' : 'filled'}
          onPress={() =>
            void (space.joined
              ? leaveCommunity(space.id)
              : joinCommunity(space.id))
          }
        />
      </AppCard>

      <Text style={styles.section}>Groups</Text>
      {groups
        .filter((g) => g.communityId === communityId)
        .map((g) => (
          <AppCard key={g.id} style={styles.group}>
            <Text style={styles.groupTitle}>{g.name}</Text>
            <Text style={styles.meta}>{g.description}</Text>
            <Text style={styles.meta}>
              {g.memberCount} members
              {g.isAnonymousFriendly ? ' · Anonymous ok' : ''}
            </Text>
          </AppCard>
        ))}

      <Text style={[styles.section, styles.spaced]}>Events</Text>
      {events
        .filter((e) => e.communityId === communityId)
        .map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleAttend={(e) =>
              void setEventAttendance(e.id, !e.attending)
            }
          />
        ))}

      <Text style={[styles.section, styles.spaced]}>Discussions</Text>
      {discussions
        .filter((d) => d.communityId === communityId)
        .map((post) => (
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
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { gap: Spacing.sm, marginBottom: Spacing.lg },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  group: { marginBottom: Spacing.sm, gap: 4 },
  groupTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  missing: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
