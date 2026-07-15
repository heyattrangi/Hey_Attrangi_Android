import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { MoodTrackingScreen } from '../screens/mood/MoodTrackingScreen';
import { TherapistListScreen } from '../screens/therapists/TherapistListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { InstitutionDashboardScreen } from '../screens/institution/InstitutionDashboardScreen';
import { Icon, AppIcons } from '../components/app/Icon';
import { Colors, Typography } from '../theme';
import { MIN_TOUCH_TARGET } from '../utils/accessibility';
import { useInstitutionStore } from '../store/institutionStore';
import { MainTabId } from '../types/domain';
import { configForRole } from '../institution/roleConfigs';
import { useI18n } from '../i18n/useI18n';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabDef = {
  name: keyof MainTabParamList;
  labelKey:
    | 'tabs.home'
    | 'tabs.campus'
    | 'tabs.companion'
    | 'tabs.mood'
    | 'tabs.therapists'
    | 'tabs.profile';
  component: React.ComponentType;
  icon: string;
  activeIcon: string;
};

const TAB_DEFS: TabDef[] = [
  {
    name: 'HomeTab',
    labelKey: 'tabs.home',
    component: HomeScreen,
    icon: AppIcons.home,
    activeIcon: AppIcons.homeActive,
  },
  {
    name: 'InstitutionTab',
    labelKey: 'tabs.campus',
    component: InstitutionDashboardScreen,
    icon: 'domain',
    activeIcon: 'domain',
  },
  {
    name: 'ChatTab',
    labelKey: 'tabs.companion',
    component: ChatScreen,
    icon: AppIcons.chat,
    activeIcon: AppIcons.chatActive,
  },
  {
    name: 'MoodTab',
    labelKey: 'tabs.mood',
    component: MoodTrackingScreen,
    icon: AppIcons.mood,
    activeIcon: AppIcons.moodActive,
  },
  {
    name: 'TherapistsTab',
    labelKey: 'tabs.therapists',
    component: TherapistListScreen,
    icon: AppIcons.therapists,
    activeIcon: AppIcons.therapistsActive,
  },
  {
    name: 'ProfileTab',
    labelKey: 'tabs.profile',
    component: ProfileScreen,
    icon: AppIcons.profile,
    activeIcon: AppIcons.profileActive,
  },
];

export const MainTabNavigator = () => {
  const activeRoleId = useInstitutionStore((s) => s.activeRoleId);
  const roleConfig = useInstitutionStore((s) => s.roleConfig);
  const loadSnapshot = useInstitutionStore((s) => s.loadSnapshot);
  const status = useInstitutionStore((s) => s.status);
  const { t, locale } = useI18n();

  useEffect(() => {
    if (status === 'idle') void loadSnapshot();
  }, [loadSnapshot, status]);

  const visible = useMemo(() => {
    const tabs =
      roleConfig?.visibleTabs ?? configForRole(activeRoleId).visibleTabs;
    const allowed = new Set<MainTabId>(tabs);
    return TAB_DEFS.filter((tDef) => allowed.has(tDef.name as MainTabId));
  }, [activeRoleId, roleConfig]);

  return (
    <Tab.Navigator
      key={`${activeRoleId}-${locale}`}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      {visible.map((tab) => {
        const label = t(tab.labelKey);
        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarLabel: label,
              tabBarAccessibilityLabel: `${label} tab`,
              tabBarIcon: ({ focused, color, size }) => (
                <Icon
                  name={focused ? tab.activeIcon : tab.icon}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.borderDefault,
    borderTopWidth: 1,
    minHeight: MIN_TOUCH_TARGET + 12,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
