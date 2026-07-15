import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  AnnouncementCard,
  InstitutionEmpty,
  InstitutionSkeletons,
} from '../../components/institution';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'InstitutionAnnouncements'
  >;
};

export const InstitutionAnnouncementsScreen: React.FC<Props> = ({
  navigation,
}) => {
  const announcements = useInstitutionStore((s) => s.announcements);
  const status = useInstitutionStore((s) => s.announcementsStatus);
  const loadAnnouncements = useInstitutionStore((s) => s.loadAnnouncements);
  const markAnnouncementRead = useInstitutionStore((s) => s.markAnnouncementRead);

  useEffect(() => {
    if (status === 'idle' || announcements.length === 0) {
      void loadAnnouncements();
    }
  }, [announcements.length, loadAnnouncements, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadAnnouncements);

  return (
    <AppScreen
      gradient="centerWarm"
      includeBottomInset
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <AppHeader title="Announcements" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Campus updates"
        subtitle="Pinned · unread · important · events · reminders"
      />
      {status === 'loading' && announcements.length === 0 ? (
        <InstitutionSkeletons variant="announcements" />
      ) : announcements.length === 0 ? (
        <InstitutionEmpty kind="announcements" />
      ) : (
        announcements.map((a, i) => (
          <AnnouncementCard
            key={a.id}
            announcement={a}
            index={i}
            onPress={(item) => void markAnnouncementRead(item.id)}
          />
        ))
      )}
    </AppScreen>
  );
};
