import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  ProgramCard,
  InstitutionEmpty,
  InstitutionSkeletons,
} from '../../components/institution';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors } from '../../app/design-system';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CampusPrograms'>;
};

export const CampusProgramsScreen: React.FC<Props> = ({ navigation }) => {
  const programs = useInstitutionStore((s) => s.programs);
  const status = useInstitutionStore((s) => s.programsStatus);
  const loadPrograms = useInstitutionStore((s) => s.loadPrograms);
  const registerProgram = useInstitutionStore((s) => s.registerProgram);

  useEffect(() => {
    if (status === 'idle' || programs.length === 0) void loadPrograms();
  }, [loadPrograms, programs.length, status]);

  const { refreshing, onRefresh } = usePullToRefresh(loadPrograms);

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
      <AppHeader title="Campus Programs" onBack={() => navigation.goBack()} />
      <SectionHeader
        title="Wellness programs"
        subtitle="Events · workshops · campaigns · group sessions"
      />
      {status === 'loading' && programs.length === 0 ? (
        <InstitutionSkeletons variant="programs" />
      ) : programs.length === 0 ? (
        <InstitutionEmpty kind="programs" />
      ) : (
        programs.map((p) => (
          <ProgramCard
            key={p.id}
            program={p}
            onRegister={(prog) => {
              if (!prog.registered) {
                void hapticSuccess();
                void registerProgram(prog.id);
              }
            }}
          />
        ))
      )}
    </AppScreen>
  );
};
