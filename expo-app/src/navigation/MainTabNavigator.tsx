import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { WellnessHubScreen } from '../screens/wellness/WellnessHubScreen';
import { MyWellbeingScreen } from '../screens/wellbeing/MyWellbeingScreen';
import { Icon, AppIcons } from '../components/app/Icon';
import { FloatingBottomTabBar } from '../components/navigation/FloatingBottomTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Primary Mobile Navigation Architecture:
 * Floating translucent glass bottom tab bar with content underlay fade overlay.
 */
export const MainTabNavigator = () => {
  React.useEffect(() => {
    console.log('[ROOT NAV] MainTabNavigator mounted with FloatingBottomTabBar');
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#FAF8F5' },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? AppIcons.homeActive : AppIcons.home}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={WellnessHubScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarAccessibilityLabel: 'Explore tab',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? AppIcons.exploreActive : AppIcons.explore}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyWellbeingTab"
        component={MyWellbeingScreen}
        options={{
          tabBarLabel: 'My Well-being',
          tabBarAccessibilityLabel: 'My Well-being tab',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="leaf"
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
