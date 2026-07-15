import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  StudentWellnessCards,
  InstitutionEmpty,
  InstitutionSkeletons,
} from '../../components/institution';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'StudentWellnessDashboard'
  >;
};

export const StudentWellnessDashboardScreen: React.FC<Props> = ({
  navigation,
}) => {
  const studentWellness = useInstitutionStore((s) => s.studentWellness);
  const status = useInstitutionStore((s) => s.status);
  const loadSnapshot = useInstitutionStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (!studentWellness) void loadSnapshot();
  }, [loadSnapshot, studentWellness]);

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Student Wellness"
        onBack={() => navigation.goBack()}
      />
      <SectionHeader
        title="Your campus care cards"
        subtitle="Mood · attendance · stress · sessions · goals"
      />
      {status === 'loading' && !studentWellness ? (
        <InstitutionSkeletons variant="dashboard" />
      ) : !studentWellness ? (
        <InstitutionEmpty kind="dashboard" />
      ) : (
        <StudentWellnessCards
          overview={studentWellness}
          onPressMood={() => navigation.navigate('MainTabs', { screen: 'MoodTab' })}
          onPressSessions={() => navigation.navigate('Sessions')}
          onPressGoals={() => navigation.navigate('ProgressDashboard')}
        />
      )}
    </AppScreen>
  );
};
