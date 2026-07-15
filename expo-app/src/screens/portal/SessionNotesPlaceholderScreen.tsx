import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader } from '../../components/app';
import { PortalPlaceholderPanel } from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'SessionNotesPlaceholder'
  >;
  route: RouteProp<MainStackParamList, 'SessionNotesPlaceholder'>;
};

export const SessionNotesPlaceholderScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const notesPlaceholder = usePortalStore((s) => s.notesPlaceholder);
  const loadNotesPlaceholder = usePortalStore((s) => s.loadNotesPlaceholder);
  const appointmentId = route.params.appointmentId;

  useEffect(() => {
    void loadNotesPlaceholder(appointmentId);
  }, [appointmentId, loadNotesPlaceholder]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Session Notes"
        subtitle="Placeholder"
        onBack={() => navigation.goBack()}
      />
      <PortalPlaceholderPanel
        title={notesPlaceholder?.title ?? 'Clinical notes'}
        message={
          notesPlaceholder?.message ??
          'Structured session notes will sync from the clinical backend later.'
        }
        bullets={[
          notesPlaceholder?.draftHint ??
            'SOAP / DAP templates and autosave are planned.',
          `Client · ${notesPlaceholder?.clientName ?? '—'}`,
        ]}
      />
    </AppScreen>
  );
};
