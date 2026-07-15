import React, { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { DashboardReorderList } from '../../components/personalization';
import { usePersonalizationStore } from '../../store/personalizationStore';
import { MainStackParamList } from '../../navigation/types';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'DashboardCustomize'>;
};

export const DashboardCustomizeScreen: React.FC<Props> = ({ navigation }) => {
  const widgets = usePersonalizationStore((s) => s.widgets);
  const reorderWidgets = usePersonalizationStore((s) => s.reorderWidgets);
  const toggleWidget = usePersonalizationStore((s) => s.toggleWidget);

  const move = useCallback(
    (id: string, dir: -1 | 1) => {
      const sorted = [...widgets].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((w) => w.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= sorted.length) return;
      const next = [...sorted];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      void hapticSelection();
      void reorderWidgets(next.map((w) => w.id));
    },
    [reorderWidgets, widgets],
  );

  return (
    <AppScreen gradient="topRightSoft" includeBottomInset>
      <AppHeader
        title="Customize Dashboard"
        onBack={() => navigation.goBack()}
      />
      <DashboardReorderList
        widgets={widgets}
        onMoveUp={(id) => move(id, -1)}
        onMoveDown={(id) => move(id, 1)}
        onToggle={(id) => {
          void hapticSelection();
          void toggleWidget(id);
        }}
      />
    </AppScreen>
  );
};
