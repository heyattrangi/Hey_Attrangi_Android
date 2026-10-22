import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { journalRepository, BackendJournalEntry } from '../../repositories/JournalRepository';
import { MainStackParamList } from '../../navigation/types';
import { Text, Colors, Radii, Spacing } from '../../design-system';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'JournalHome'>;
};

export const JournalHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [entries, setEntries] = useState<BackendJournalEntry[]>([]);

  useEffect(() => {
    void journalRepository.list().then(setEntries).catch(() => setEntries([]));
  }, []);

  const handleBack = () => {
    void hapticLight();
    navigation.goBack();
  };

  const handleBeginReflection = () => {
    void hapticSelection();
    navigation.navigate('JournalEntry', {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.hamburgerBtn} onPress={handleBack} activeOpacity={0.8}>
            <View style={styles.barLine} />
            <View style={styles.barLine} />
            <View style={styles.barLine} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.backLink} onPress={handleBack} activeOpacity={0.7}>
            <Text style={styles.backLinkText}>‹ BACK</Text>
          </TouchableOpacity>
        </View>

        {/* Large Edit Icon Box (Matching Screenshot 18) */}
        <View style={styles.heroIconBox}>
          <Icon name={AppIcons.pencil} size={36} color="#FF7D5C" />
        </View>

        {/* Badges Row */}
        <View style={styles.badgesRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>Journaling</Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>⏱ 5 min</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.mainTitle}>Journal Reflection</Text>
        <Text style={styles.subtitle}>
          A quiet prompt to write whatever is on your mind.
        </Text>

        {/* About Section */}
        <View style={styles.sectionCol}>
          <Text style={styles.sectionHeaderTag}>ABOUT THIS ACTIVITY</Text>
          <Text style={styles.sectionBodyText}>
            A short writing space with a simple prompt. You can jot a few lines or more — whatever
            feels useful. There is no need for polish or a particular outcome.
          </Text>
        </View>

        {/* Activity Information Summary Card */}
        <View style={styles.infoSummaryCard}>
          <Text style={styles.infoCardHeader}>ACTIVITY INFORMATION</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>Journaling</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Duration</Text>
            <Text style={styles.infoValue}>5 min</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Difficulty</Text>
            <Text style={styles.infoValue}>Beginner</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Audio Available</Text>
            <Text style={styles.infoValue}>No</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>Reflection</Text>
          </View>
        </View>

        {/* Bottom CTA Begin Button (Matching Screenshot 17) */}
        <TouchableOpacity style={styles.beginBtn} onPress={handleBeginReflection} activeOpacity={0.85}>
          <Text style={styles.beginBtnText}>Begin</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFB',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4A2E1B',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  barLine: {
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  backLink: {
    paddingVertical: 4,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0E1726',
    letterSpacing: 1,
  },
  heroIconBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE3D6',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E1726',
  },
  durationBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  durationBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0E1726',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 28,
  },
  sectionCol: {
    marginBottom: 24,
  },
  sectionHeaderTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sectionBodyText: {
    fontSize: 15,
    color: '#0E1726',
    lineHeight: 23,
  },
  infoSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 28,
    gap: 12,
  },
  infoCardHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0E1726',
  },
  beginBtn: {
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  beginBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
