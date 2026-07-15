import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  MonthlyGoalCard,
  EngagementEmpty,
  EngagementSkeletons,
} from '../../components/engagement';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useEngagementStore } from '../../store/engagementStore';
import { MainStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MonthlyGoals'>;
};

export const MonthlyGoalsScreen: React.FC<Props> = ({ navigation }) => {
  const monthlyGoals = useEngagementStore((s) => s.monthlyGoals);
  const status = useEngagementStore((s) => s.status);
  const loadSnapshot = useEngagementStore((s) => s.loadSnapshot);

  useEffect(() => {
    if (status === 'idle' || monthlyGoals.length === 0) {
      void loadSnapshot();
    }
  }, [loadSnapshot, monthlyGoals.length, status]);

  const current = useMemo(
    () => monthlyGoals.filter((g) => g.monthLabel === 'This month'),
    [monthlyGoals],
  );
  const history = useMemo(
    () => monthlyGoals.filter((g) => g.monthLabel !== 'This month'),
    [monthlyGoals],
  );

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader title="Monthly Goals" onBack={() => navigation.goBack()} />
      {status === 'loading' && monthlyGoals.length === 0 ? (
        <EngagementSkeletons variant="challenge" />
      ) : monthlyGoals.length === 0 ? (
        <EngagementEmpty kind="goals" />
      ) : (
        <View>
          <SectionHeader
            title="This month"
            subtitle="Progress · completion · partial"
          />
          {current.map((g) => (
            <MonthlyGoalCard key={g.id} goal={g} />
          ))}
          {history.length > 0 ? (
            <>
              <SectionHeader title="Goal history" subtitle="Past intentions" />
              {history.map((g) => (
                <MonthlyGoalCard key={g.id} goal={g} />
              ))}
            </>
          ) : null}
        </View>
      )}
    </AppScreen>
  );
};
