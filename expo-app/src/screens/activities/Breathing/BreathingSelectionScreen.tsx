import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/app/Icon';
import { AppScreen } from '../../../components/app';
import { hapticLight, hapticSelection } from '../../../utils/haptics';
import {
  BREATHING_CONFIGS,
  BreathingExerciseConfig,
} from '../../../components/explore/breathing/breathingConfigs';

interface BreathingSelectionScreenProps {
  onSelectExercise: (config: BreathingExerciseConfig) => void;
  onBack: () => void;
}

export const BreathingSelectionScreen: React.FC<BreathingSelectionScreenProps> = ({
  onSelectExercise,
  onBack,
}) => {
  const configs = Object.values(BREATHING_CONFIGS);

  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Back Button & Header */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            void hapticLight();
            onBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Back to Activities"
        >
          <Icon name="chevron-left" size={20} color="#4B5563" />
          <Text style={styles.backText}>Activities</Text>
        </TouchableOpacity>

        <Text style={styles.titleText}>Breathing</Text>
        <Text style={styles.subtitleText}>Find a rhythm that feels right for you.</Text>

        {configs.map((config) => {
          const patternString = config.phases
            .map((p) => `${p.label} (${p.seconds}s)`)
            .join(' → ');

          const durationText =
            config.durationOptions.find((d) => d.cycles === config.defaultCycles)?.label ||
            '3 min';

          return (
            <View key={config.slug} style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>{config.title}</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{durationText.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.cardSubtitle}>{config.subtitle}</Text>
              <Text style={styles.cardDescription}>{config.description}</Text>

              <View style={styles.patternBox}>
                <Text style={styles.patternLabel}>PATTERN</Text>
                <Text style={styles.patternText}>{patternString}</Text>
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => {
                  void hapticSelection();
                  onSelectExercise(config);
                }}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel={`Start ${config.title}`}
              >
                <Text style={styles.startBtnText}>Start {config.title}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  titleText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  badgePill: {
    backgroundColor: 'rgba(157, 184, 232, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284C7',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  patternBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patternLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  patternText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  startBtn: {
    backgroundColor: '#9DB8E8',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
});
