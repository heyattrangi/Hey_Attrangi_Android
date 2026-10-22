import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { EXPLORE_COLORS, EXPLORE_METRICS } from './ExploreTokens';

export type ExploreTabMode = 'activities' | 'read' | 'listen' | 'assessments';

export interface ExploreTabItem {
  id: ExploreTabMode;
  label: string;
}

interface ExploreTabSwitcherProps {
  activeTab: ExploreTabMode;
  onTabChange: (tab: ExploreTabMode) => void;
  tabs?: ExploreTabItem[];
}

const DEFAULT_TABS: ExploreTabItem[] = [
  { id: 'activities', label: 'Activities' },
  { id: 'read', label: 'Read' },
  { id: 'listen', label: 'Listen' },
  { id: 'assessments', label: 'Assessments' },
];

export const ExploreTabSwitcher: React.FC<ExploreTabSwitcherProps> = ({
  activeTab,
  onTabChange,
  tabs = DEFAULT_TABS,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.85}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: EXPLORE_METRICS.horizontalMargin,
    paddingTop: 8,
    paddingBottom: 16,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#EFECE6',
    borderRadius: 24,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  tabTextActive: {
    color: '#1E293B',
    fontWeight: '800',
  },
});
