import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ClientListItem } from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'TherapistClientList'
  >;
};

export const TherapistClientListScreen: React.FC<Props> = ({ navigation }) => {
  const clients = usePortalStore((s) => s.clients);
  const status = usePortalStore((s) => s.status);
  const loadClients = usePortalStore((s) => s.loadClients);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!clients.length) void loadSnapshot();
    else void loadClients();
  }, [clients.length, loadClients, loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Client List"
        subtitle="Caseload overview"
        onBack={() => navigation.goBack()}
      />
      {status === 'loading' && !clients.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {clients.map((client) => (
        <ClientListItem
          key={client.id}
          client={client}
          onPress={() => navigation.navigate('TherapistAppointments')}
        />
      ))}
      {!clients.length && status !== 'loading' ? (
        <Text style={styles.empty}>No clients in mock caseload.</Text>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  empty: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});
