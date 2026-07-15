import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { EventCard } from '../../components/community';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CommunityEvents'>;
};

export const CommunityEventsScreen: React.FC<Props> = ({ navigation }) => {
  const events = useCommunityStore((s) => s.events);
  const loadSnapshot = useCommunityStore((s) => s.loadSnapshot);
  const setEventAttendance = useCommunityStore((s) => s.setEventAttendance);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Events"
        subtitle="RSVP-ready (frontend)"
        onBack={() => navigation.goBack()}
      />
      {events.length === 0 ? (
        <Text style={styles.empty}>No events yet.</Text>
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleAttend={(e) =>
              void setEventAttendance(e.id, !e.attending)
            }
          />
        ))
      )}
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
