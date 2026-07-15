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
    'SessionAiSummaryPlaceholder'
  >;
  route: RouteProp<MainStackParamList, 'SessionAiSummaryPlaceholder'>;
};

export const SessionAiSummaryPlaceholderScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const aiSummaryPlaceholder = usePortalStore((s) => s.aiSummaryPlaceholder);
  const loadAiSummaryPlaceholder = usePortalStore(
    (s) => s.loadAiSummaryPlaceholder,
  );
  const appointmentId = route.params.appointmentId;

  useEffect(() => {
    void loadAiSummaryPlaceholder(appointmentId);
  }, [appointmentId, loadAiSummaryPlaceholder]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="AI Summary"
        subtitle="Placeholder"
        onBack={() => navigation.goBack()}
      />
      <PortalPlaceholderPanel
        badge="AI · Placeholder"
        title={aiSummaryPlaceholder?.title ?? 'Post-session AI summary'}
        message={
          aiSummaryPlaceholder?.message ??
          'Assistive summaries will appear here after clinician review gates land.'
        }
        bullets={[
          ...(aiSummaryPlaceholder?.bulletHints ?? [
            'Themes, risks, homework — clinician editable',
          ]),
          `Client · ${aiSummaryPlaceholder?.clientName ?? '—'}`,
        ]}
      />
    </AppScreen>
  );
};
