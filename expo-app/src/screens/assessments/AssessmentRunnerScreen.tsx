import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { SCREENERS, QuestionOption } from '../../data/assessmentsData';
import { assessmentRepository } from '../../repositories/AssessmentRepository';
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
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'AssessmentRunner'>;

export const AssessmentRunnerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const assessmentKey = route.params?.assessmentKey || 'phq-9';
  const screener = SCREENERS[assessmentKey] || SCREENERS['phq-9'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const currentQuestion = screener.questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / screener.questions.length) * 100;

  const handleSelectOption = async (option: QuestionOption) => {
    void hapticSelection();

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: option.value,
    };
    setAnswers(updatedAnswers);

    if (currentIndex < screener.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all questions -> submit to backend
      setLoading(true);
      const responsesPayload = Object.entries(updatedAnswers).map(([qId, val]) => ({
        questionId: qId,
        selectedValue: val,
      }));

      try {
        const res = await assessmentRepository.submitAssessment({
          assessmentKey,
          responses: responsesPayload,
        });

        void hapticSuccess();
        const finalResult = res.result || {
          score: Object.values(updatedAnswers).reduce((a, b) => a + b, 0),
          severity: 'Completed',
          interpretation: `Completed ${screener.title}`,
        };

        navigation.replace('AssessmentResult', { result: finalResult });
      } catch {
        // Fallback local scoring if offline
        const localScore = Object.values(updatedAnswers).reduce((a, b) => a + b, 0);
        navigation.replace('AssessmentResult', {
          result: {
            score: localScore,
            severity: localScore > 10 ? 'Moderate' : 'Mild',
            interpretation: `Completed ${screener.title}`,
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      void hapticLight();
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Screen backgroundColor={Colors.background}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
        >
          <Icon name={AppIcons.back} size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="heading1" style={styles.headerTitle}>
          {screener.title}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progressPercent}%` }]} />
        </View>
        <Text variant="caption" color={Colors.textMuted} style={styles.progressText}>
          Question {currentIndex + 1} of {screener.questions.length} ({Math.round(progressPercent)}%)
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.brandPrimary} />
            <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.loadingText}>
              Analyzing your clinical answers...
            </Text>
          </View>
        ) : (
          <Card variant="default" style={styles.questionCard}>
            <Badge variant="brand" label={`Question ${currentIndex + 1}`} />

            <Text variant="heading2" style={styles.questionText}>
              {currentQuestion.text}
            </Text>

            <View style={styles.optionsList}>
              {currentQuestion.options.map((opt, i) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                    onPress={() => handleSelectOption(opt)}
                    activeOpacity={0.8}
                  >
                    <Text
                      variant="bodyMedium"
                      style={[styles.optionText, isSelected ? styles.optionTextSelected : {}]}
                    >
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {currentIndex > 0 ? (
              <Button
                variant="secondary"
                label="← Previous Question"
                onPress={handlePrevious}
                style={styles.prevBtn}
              />
            ) : null}
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderDefault,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.brandPrimary,
  },
  progressText: {
    textAlign: 'right',
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
  },
  questionCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionBtn: {
    backgroundColor: Colors.background,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  optionBtnSelected: {
    backgroundColor: Colors.brandLight,
    borderColor: Colors.brandPrimary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: Colors.brandPrimary,
  },
  prevBtn: {
    marginTop: Spacing.md,
  },
});
