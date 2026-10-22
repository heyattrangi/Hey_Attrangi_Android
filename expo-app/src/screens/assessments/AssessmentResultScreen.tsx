import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { AssessmentScoreGauge } from '../../components/assessments/AssessmentScoreGauge';
import { MainStackParamList } from '../../navigation/types';
import { AppScreen } from '../../components/app';
import { Spacing } from '../../design-system';
import { hapticLight } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'AssessmentResult'>;

export const AssessmentResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const result = route.params?.result || {
    score: 0,
    severity: 'Completed',
    interpretation: 'Assessment completed successfully.',
  };

  const isCrisisRisk = Boolean(result.hasCrisisRisk || result.severity === 'Severe');

  const formattedDate = result?.date
    ? new Date(result.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const handleReturnToExplore = () => {
    void hapticLight();
    navigation.navigate('MainTabs', { screen: 'ExploreTab' });
  };

  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Navigation Back Link */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={handleReturnToExplore}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={20} color="#F97316" />
          <Text style={styles.backText}>Back to Assessments</Text>
        </TouchableOpacity>

        {/* Page Title & Date */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Assessment{'\n'}Results</Text>
          <Text style={styles.completedDateText}>Completed {formattedDate}</Text>
        </View>

        {/* Crisis Alert Banner if applicable */}
        {isCrisisRisk ? (
          <View style={styles.crisisBanner}>
            <View style={styles.crisisHeader}>
              <Icon name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.crisisTitle}>Support is available immediately</Text>
            </View>
            <Text style={styles.crisisBody}>
              If you or someone you know is feeling overwhelmed or having thoughts of self-harm, please reach out now. You are not alone.
            </Text>
            <View style={styles.helplineBox}>
              <Text style={styles.helplineLabel}>Tele-MANAS Mental Health Helpline (India):</Text>
              <Text style={styles.helplineNumber}>14416 / 1800-891-4416</Text>
            </View>
          </View>
        ) : null}

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.yourScoreLabel}>YOUR SCORE</Text>

          {/* Semicircular Gauge Component */}
          <AssessmentScoreGauge
            score={result.score}
            maxScore={result.maxScore}
            status={result.severity}
          />
        </View>

        {/* What This Means Card */}
        <View style={styles.interpretationCard}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="information-outline" size={22} color="#F97316" />
            <Text style={styles.sectionTitle}>What this means</Text>
          </View>

          <Text style={styles.interpretationBody}>
            {result.interpretation}
          </Text>

          {result.recommendation ? (
            <View style={styles.recommendationInset}>
              <Text style={styles.recommendationHeader}>Next Steps & Guidance</Text>
              <Text style={styles.recommendationText}>{result.recommendation}</Text>
            </View>
          ) : null}
        </View>

        {/* Primary Action Button: Return to Assessments */}
        <TouchableOpacity
          style={styles.primaryReturnBtn}
          onPress={handleReturnToExplore}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Return to Assessments"
        >
          <Text style={styles.primaryReturnBtnText}>Return to Assessments</Text>
        </TouchableOpacity>

        {/* Clinical Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            This is a screening tool, not a diagnostic instrument. Please consult with a qualified healthcare provider for a formal diagnosis.
          </Text>
        </View>
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
    marginLeft: 2,
  },
  titleBlock: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  completedDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 6,
  },
  crisisBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 20,
    gap: 8,
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crisisTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
  },
  crisisBody: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  helplineBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  helplineLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
  },
  helplineNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: 2,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  yourScoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  interpretationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
  },
  interpretationBody: {
    fontSize: 15,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 23,
  },
  recommendationInset: {
    backgroundColor: '#FAF8F5',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F97316',
  },
  recommendationHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  primaryReturnBtn: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  primaryReturnBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimerBox: {
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
