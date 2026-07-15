import React, { useEffect } from 'react';
import { Alert, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  ResourceCard,
  InstitutionEmpty,
  InstitutionSkeletons,
} from '../../components/institution';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CampusResources'>;
};

export const CampusResourcesScreen: React.FC<Props> = ({ navigation }) => {
  const resources = useInstitutionStore((s) => s.resources);
  const emergencyContacts = useInstitutionStore((s) => s.emergencyContacts);
  const status = useInstitutionStore((s) => s.resourcesStatus);
  const loadResources = useInstitutionStore((s) => s.loadResources);
  const loadSnapshot = useInstitutionStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (status === 'idle' || resources.length === 0) {
      void loadResources();
      if (emergencyContacts.length === 0) void loadSnapshot();
    }
  }, [
    emergencyContacts.length,
    loadResources,
    loadSnapshot,
    resources.length,
    status,
  ]);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await Promise.all([loadResources(), loadSnapshot()]);
  });

  return (
    <AppScreen
      gradient="topRightSoft"
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
      <AppHeader title="Campus Resources" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Support & safety"
        subtitle="Emergency · counselling · helpline · maps · links"
      />
      {status === 'loading' && resources.length === 0 ? (
        <InstitutionSkeletons variant="resources" />
      ) : resources.length === 0 ? (
        <InstitutionEmpty kind="resources" />
      ) : (
        resources.map((r) => (
          <ResourceCard
            key={r.id}
            resource={r}
            onPress={(item) => {
              Alert.alert(
                item.title,
                item.value
                  ? `${item.description}\n\n${item.value}`
                  : item.description,
              );
            }}
          />
        ))
      )}
    </AppScreen>
  );
};
