import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { hapticSelection } from '../../utils/haptics';

export const FLOATING_NAV_TOKENS = {
  HEIGHT: 60,
  HORIZONTAL_MARGIN: 28,
  BACKGROUND_OPACITY: 1.0,
  CONTENT_BOTTOM_INSET: 110,
};

export const FloatingBottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(16, insets.bottom + 8);
  const containerHeight = FLOATING_NAV_TOKENS.HEIGHT;
  const fadeHeight = containerHeight + bottomInset + 36;

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">
      {/* 1. Translucent Bottom & Safe Area Backdrop (ChatGPT-style translucent layer below/behind tab bar) */}
      <View style={[styles.fadeContainer, { height: fadeHeight }]} pointerEvents="none">
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="bottomFadeGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FAF8F5" stopOpacity="0" />
              <Stop offset="0.4" stopColor="#FAF8F5" stopOpacity="0.55" />
              <Stop offset="0.75" stopColor="#FAF8F5" stopOpacity="0.85" />
              <Stop offset="1.0" stopColor="#FAF8F5" stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bottomFadeGradient)" />
        </Svg>
      </View>

      {/* 2. Completely Opaque Floating Navigation Surface */}
      <View style={[styles.tabBarPill, { bottom: bottomInset }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            void hapticSelection();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? '#FF7D5C' : '#94A3B8';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || String(label)}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.75}
            >
              {options.tabBarIcon ? (
                options.tabBarIcon({ focused: isFocused, color, size: 20 })
              ) : null}
              <Text style={[styles.tabLabel, { color }]}>
                {typeof label === 'string' ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fadeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '85%',
    maxWidth: 380,
    height: FLOATING_NAV_TOKENS.HEIGHT,
    borderRadius: 30,
    backgroundColor: '#FFFFFF', // 100% Solid Opaque White Tab Bar
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
});
