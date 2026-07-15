import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  InstitutionNotificationRow,
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
    'InstitutionNotifications'
  >;
};

export const InstitutionNotificationsScreen: React.FC<Props> = ({
  navigation,
}) => {
  const items = useInstitutionStore((s) => s.institutionNotifications);
  const status = useInstitutionStore((s) => s.notificationsStatus);
  const loadNotifications = useInstitutionStore((s) => s.loadNotifications);

  useEffect(() => {
    if (status === 'idle' || items.length === 0) void loadNotifications();
  }, [items.length, loadNotifications, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadNotifications);

  return (
    <AppScreen
      gradient="topRightWarm"
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
      <AppHeader
        title="Campus Notifications"
        onBack={() => navigation.goBack()}
      />
      <SectionHeader
        title="Institution inbox"
        subtitle="Separate from personal notifications"
        actionLabel="Personal"
        onAction={() => navigation.navigate('NotificationCenter')}
      />
      {status === 'loading' && items.length === 0 ? (
        <InstitutionSkeletons variant="announcements" />
      ) : items.length === 0 ? (
        <InstitutionEmpty kind="notifications" />
      ) : (
        items.map((item) => (
          <InstitutionNotificationRow key={item.id} item={item} />
        ))
      )}
    </AppScreen>
  );
};
