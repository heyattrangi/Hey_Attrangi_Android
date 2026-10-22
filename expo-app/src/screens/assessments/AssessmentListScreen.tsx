import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { CLINICAL_ASSESSMENTS, ClinicalAssessment } from '../../data/assessmentsData';
import { MainStackParamList } from '../../navigation/types';
import { AppScreen } from '../../components/app';
import { Spacing } from '../../design-system';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import { AssessmentHero, AssessmentCard } from '../../components/explore';
import { PremiumLimitModal } from '../../components/premium/PremiumLimitModal';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const AssessmentListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredAssessments = CLINICAL_ASSESSMENTS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : item.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!searchQuery) return matchesCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.shortName.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const checkAssessmentEntitlement = async (): Promise<boolean> => {
    const userPlan = useProfileStore.getState().userPlan;
    const activePlanId = useBillingStore.getState().activePlanId;
    const isPremiumUser =
      activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

    if (isPremiumUser) return true;

    try {
      await useProfileStore.getState().fetchPatientLimits();
    } catch {
      return true; // Infrastructure error -> allow attempt
    }

    const limits = useProfileStore.getState().patientLimits;
    const assessmentUsage = limits?.usage?.assessments;

    if (assessmentUsage) {
      const remaining =
        typeof assessmentUsage.remaining === 'number'
          ? assessmentUsage.remaining
          : parseInt(String(assessmentUsage.remaining), 10);
      const used = assessmentUsage.used;
      const limit =
        typeof assessmentUsage.limit === 'number'
          ? assessmentUsage.limit
          : parseInt(String(assessmentUsage.limit), 10);

      if ((!Number.isNaN(remaining) && remaining <= 0) || (used >= limit && limit > 0)) {
        setPremiumModalVisible(true);
        return false;
      }
    }

    return true;
  };

  const handleStartAssessment = async (assessment: ClinicalAssessment) => {
    void hapticSelection();
    const allowed = await checkAssessmentEntitlement();
    if (!allowed) return;
    navigation.navigate('AssessmentRunner', { assessmentKey: assessment.id });
  };

  const handleStartDynamic = async () => {
    void hapticSelection();
    const allowed = await checkAssessmentEntitlement();
    if (!allowed) return;
    navigation.navigate('DynamicAssessment');
  };

  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Back Row */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
        >
          <Icon name="chevron-left" size={20} color="#4B5563" />
          <Text style={styles.backLabel}>Explore</Text>
        </TouchableOpacity>

        {/* Assessment Hero */}
        <AssessmentHero onStartDynamicPress={handleStartDynamic} />

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assessments..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {[
            'All',
            'Depression',
            'Anxiety',
            'ADHD',
            'OCD',
            'PTSD',
            'Stress',
            'Wellbeing',
            'Safety',
            'Self-Esteem',
            'Substance Use',
            'Eating Disorders',
            'Burnout',
          ].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Assessments</Text>
          <View style={{ marginLeft: 4 }}>
            <Icon name="chevron-forward" size={16} color="#0F172A" />
          </View>
        </View>

        {/* Assessment Cards List — Individual Non-Overlapping Vertical Layout with Generous Spacing */}
        <View style={styles.cardListContainer}>
          {filteredAssessments.map((item) => (
            <AssessmentCard
              key={item.id}
              id={item.id}
              title={item.title}
              shortName={item.shortName}
              description={item.description}
              time={item.time}
              category={item.category}
              onPress={() => handleStartAssessment(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Premium Limit Modal */}
      <PremiumLimitModal
        visible={premiumModalVisible}
        cardType="ASSESSMENT"
        onDismiss={() => setPremiumModalVisible(false)}
        onUpgrade={() => {
          setPremiumModalVisible(false);
          navigation.navigate('SubscriptionComparison');
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardListContainer: {
    gap: 16,
    paddingTop: 4,
  },
});
