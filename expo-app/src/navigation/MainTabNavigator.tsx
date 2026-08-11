import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { WellnessHubScreen } from '../screens/wellness/WellnessHubScreen';
import { JourneyScreen } from '../screens/journey/JourneyScreen';
import { Icon, AppIcons } from '../components/app/Icon';
import { Colors, Typography, Radii, Spacing } from '../design-system';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Primary Mobile Navigation Architecture:
 * 1. Home (Personalized Dashboard)
 * 2. Explore (Wellness Hub: Activities | Read | Listen | Assessments)
 * 3. Journey (Personal Wellness Timeline)
 */
export const MainTabNavigator = () => {
  React.useEffect(() => {
    console.log('[ROOT NAV] MainTabNavigator mounted');
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.brandPrimary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? AppIcons.homeActive : AppIcons.home}
              size={size}
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
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? AppIcons.journeyActive : AppIcons.journey}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="JourneyTab"
        component={JourneyScreen}
        options={{
          tabBarLabel: 'Journey',
          tabBarAccessibilityLabel: 'Journey tab',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? AppIcons.moodActive : AppIcons.mood}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.borderDefault,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: Typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
});
