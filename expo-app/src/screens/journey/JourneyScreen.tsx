import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { MainStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Colors,
  Typography,
  Spacing,
  Radii,
} from '../../design-system';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export interface JourneyEvent {
  id: string;
  type: 'mood' | 'grounding' | 'journal' | 'breathing' | 'assessment' | 'audio';
  title: string;
  description: string;
  timestamp: string;
  dateGroup: 'Today' | 'Yesterday' | '2 days ago' | '3 days ago' | 'This Week';
  icon: string;
  badgeLabel: string;
  badgeVariant?: 'brand' | 'success' | 'info' | 'purple';
}

const DUMMY_JOURNEY_EVENTS: JourneyEvent[] = [
  {
    id: 'evt-1',
    type: 'grounding',
    title: 'Completed 5-4-3-2-1 Grounding',
    description: '4-minute sensory reset session to center thoughts.',
    timestamp: '10:30 AM',
    dateGroup: 'Today',
    icon: AppIcons.journey,
    badgeLabel: 'Grounding',
    badgeVariant: 'brand',
  },
  {
    id: 'evt-2',
    type: 'mood',
    title: 'Logged Mood: Good',
    description: 'Feeling calm, focused, and ready for the day.',
    timestamp: '8:15 AM',
    dateGroup: 'Today',
    icon: AppIcons.mood,
    badgeLabel: 'Mood Check',
    badgeVariant: 'success',
  },
  {
    id: 'evt-3',
    type: 'journal',
    title: 'Wrote a Journal Reflection',
    description: 'Reflected on work progress and evening wind-down.',
    timestamp: '9:45 PM',
    dateGroup: 'Yesterday',
    icon: AppIcons.chat,
    badgeLabel: 'Journal',
    badgeVariant: 'info',
  },
  {
    id: 'evt-4',
    type: 'breathing',
    title: 'Guided Box Breathing',
    description: '5 minutes of slow 4-4-4-4 diaphragmatic breathing.',
    timestamp: '3:20 PM',
    dateGroup: 'Yesterday',
    icon: AppIcons.journey,
    badgeLabel: 'Breathing',
    badgeVariant: 'brand',
  },
  {
    id: 'evt-5',
    type: 'assessment',
    title: 'Completed PHQ-9 Assessment',
    description: 'Score: 4 (Minimal) — Healthy emotional baseline.',
    timestamp: '11:00 AM',
    dateGroup: '2 days ago',
    icon: AppIcons.check,
    badgeLabel: 'Assessment',
    badgeVariant: 'purple',
  },
  {
    id: 'evt-6',
    type: 'audio',
    title: 'Listened to Ocean Waves',
    description: '15-minute ambient shoreline relaxation session.',
    timestamp: '10:15 PM',
    dateGroup: '3 days ago',
    icon: AppIcons.chat,
    badgeLabel: 'Listen',
    badgeVariant: 'info',
  },
];

export const JourneyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filter, setFilter] = useState<'all' | 'activities' | 'mood' | 'journal'>('all');

  const filteredEvents = DUMMY_JOURNEY_EVENTS.filter((evt) => {
    if (filter === 'all') return true;
    if (filter === 'activities') return evt.type === 'grounding' || evt.type === 'breathing' || evt.type === 'audio';
    if (filter === 'mood') return evt.type === 'mood';
    if (filter === 'journal') return evt.type === 'journal';
    return true;
  });

  // Group events by dateGroup
  const groupedEvents = filteredEvents.reduce<Record<string, JourneyEvent[]>>((acc, evt) => {
    if (!acc[evt.dateGroup]) acc[evt.dateGroup] = [];
    acc[evt.dateGroup].push(evt);
    return acc;
  }, {});

  return (
    <Screen backgroundColor={Colors.background}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text variant="heading1" style={styles.headerTitle}>
            Your Journey
          </Text>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => {
              void hapticLight();
              navigation.navigate('ProfileTab' as any);
            }}
          >
            <Icon name={AppIcons.profile} size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
          Your personal timeline of wellness check-ins, reflections, and progress.
        </Text>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'activities', label: 'Exercises' },
            { id: 'mood', label: 'Mood Logs' },
            { id: 'journal', label: 'Journal' },
          ].map((f) => {
            const isSelected = filter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => {
                  void hapticSelection();
                  setFilter(f.id as any);
                }}
              >
                <Text
                  variant="caption"
                  style={[styles.filterChipText, isSelected ? styles.filterChipTextSelected : {}]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedEvents).length === 0 ? (
          <Card variant="default" style={styles.emptyCard}>
            <Icon name={AppIcons.journey} size={32} color={Colors.textMuted} />
            <Text variant="heading3" style={styles.emptyTitle}>
              No events found
            </Text>
            <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.emptyText}>
              Start a grounding exercise or log your mood to build your journey timeline.
            </Text>
          </Card>
        ) : (
          Object.entries(groupedEvents).map(([groupName, events]) => (
            <View key={groupName} style={styles.groupSection}>
              <View style={styles.groupHeader}>
                <View style={styles.groupDot} />
                <Text variant="caption" color={Colors.textMuted} style={styles.groupTitle}>
                  {groupName.toUpperCase()}
                </Text>
              </View>

              <View style={styles.timelineList}>
                {events.map((evt, idx) => (
                  <View key={evt.id} style={styles.timelineItem}>
                    <View style={styles.timelineLineContainer}>
                      <View style={styles.iconCircle}>
                        <Icon name={evt.icon} size={16} color={Colors.brandPrimary} />
                      </View>
                      {idx < events.length - 1 && <View style={styles.verticalLine} />}
                    </View>

                    <Card variant="default" style={styles.eventCard}>
                      <View style={styles.eventHeader}>
                        <Badge variant="brand" label={evt.badgeLabel} />
                        <Text variant="caption" color={Colors.textMuted}>
                          {evt.timestamp}
                        </Text>
                      </View>

                      <Text variant="heading3" style={styles.eventTitle}>
                        {evt.title}
                      </Text>
                      <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.eventDesc}>
                        {evt.description}
                      </Text>
                    </Card>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xs,
    gap: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  filterChipSelected: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  filterChipText: {
    fontWeight: '700',
    color: Colors.textSecondary,
    fontSize: 12,
  },
  filterChipTextSelected: {
    color: Colors.white,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  groupSection: {
    gap: Spacing.xs,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  groupTitle: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timelineList: {
    gap: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timelineLineContainer: {
    alignItems: 'center',
    width: 32,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brandLight,
    borderWidth: 1,
    borderColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.borderDefault,
    marginTop: 4,
  },
  eventCard: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  eventDesc: {
    fontSize: 13,
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    textAlign: 'center',
  },
});
