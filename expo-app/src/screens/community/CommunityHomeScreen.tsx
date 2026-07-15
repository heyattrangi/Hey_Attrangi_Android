import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  CommunityCard,
  DiscussionCardView,
  EventCard,
} from '../../components/community';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CommunityHome'>;
};

export const CommunityHomeScreen: React.FC<Props> = ({ navigation }) => {
  const spaces = useCommunityStore((s) => s.spaces);
  const discussions = useCommunityStore((s) => s.discussions);
  const events = useCommunityStore((s) => s.events);
  const anonymous = useCommunityStore((s) => s.anonymous);
  const status = useCommunityStore((s) => s.status);
  const loadSnapshot = useCommunityStore((s) => s.loadSnapshot);
  const joinCommunity = useCommunityStore((s) => s.joinCommunity);
  const leaveCommunity = useCommunityStore((s) => s.leaveCommunity);
  const toggleSavePost = useCommunityStore((s) => s.toggleSavePost);
  const setEventAttendance = useCommunityStore((s) => s.setEventAttendance);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Community"
        subtitle="Peers · groups · events"
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle}>Belong gently</Text>
        <Text style={styles.heroBody} maxFontSizeMultiplier={1.3}>
          Join communities, join group discussions, and RSVP to wellness events.
          Anonymous mode and reporting are ready for a future backend.
        </Text>
        {anonymous?.enabled ? (
          <Text style={styles.anon}>
            Anonymous on · {anonymous.displayName}
          </Text>
        ) : null}
      </AppCard>

      <View style={styles.quick}>
        {(
          [
            ['CommunityGroups', 'Groups'],
            ['CommunityEvents', 'Events'],
            ['PeerDiscussions', 'Discussions'],
            ['AnonymousMode', 'Anonymous'],
            ['SavedPosts', 'Saved'],
            ['GroupWellness', 'Group wellness'],
            ['ModerationQueue', 'Moderation'],
            ['ContentReport', 'Report'],
          ] as const
        ).map(([screen, label]) => (
          <Pressable
            key={screen}
            style={styles.chip}
            onPress={() => {
              void hapticSelection();
              navigation.navigate(screen);
            }}
            {...buttonA11y(label)}
          >
            <Text style={styles.chipText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Communities</Text>
      {status === 'loading' && !spaces.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {spaces.map((space) => (
        <CommunityCard
          key={space.id}
          space={space}
          onPress={() =>
            navigation.navigate('CommunityDetail', { communityId: space.id })
          }
          onJoinToggle={(s) =>
            void (s.joined ? leaveCommunity(s.id) : joinCommunity(s.id))
          }
        />
      ))}

      <Text style={[styles.section, styles.spaced]}>Upcoming events</Text>
      {events.slice(0, 2).map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onToggleAttend={(e) =>
            void setEventAttendance(e.id, !e.attending)
          }
        />
      ))}

      <Text style={[styles.section, styles.spaced]}>Peer discussions</Text>
      {discussions.slice(0, 2).map((post) => (
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
  hero: { gap: Spacing.xs, marginBottom: Spacing.md },
  heroTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  heroBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  anon: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: 4,
  },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  spaced: { marginTop: Spacing.lg },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
