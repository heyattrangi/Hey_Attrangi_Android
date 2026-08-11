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
import { CLINICAL_ASSESSMENTS, ClinicalAssessment } from '../../data/assessmentsData';
import { MainStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Input,
  Colors,
  Typography,
  Spacing,
  Radii,
} from '../../design-system';
import { hapticLight, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const AssessmentListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssessments = CLINICAL_ASSESSMENTS.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.shortName.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const handleStartAssessment = (assessment: ClinicalAssessment) => {
    void hapticSelection();
    navigation.navigate('AssessmentRunner', { assessmentKey: assessment.id });
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
          Clinical Assessments
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
          Gain insight into your mental and emotional health with validated clinical screeners.
        </Text>

        {/* Search Bar */}
        <Input
          placeholder="Search assessments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Assessment Cards */}
        <View style={styles.cardList}>
          {filteredAssessments.map((item) => (
            <Card
              key={item.id}
              variant="default"
              onPress={() => handleStartAssessment(item)}
              style={styles.card}
            >
              <View style={styles.badgeRow}>
                <Badge variant="brand" label={item.shortName} />
                <Text variant="caption" color={Colors.textMuted}>
                  {item.time}
                </Text>
              </View>

              <Text variant="heading2" style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.cardDesc}>
                {item.description}
              </Text>

              <View style={styles.cardFooter}>
                <Text variant="caption" color={Colors.textMuted} style={styles.categoryText}>
                  {item.category}
                </Text>
                <Button
                  variant="primary"
                  label="TAKE ASSESSMENT"
                  onPress={() => handleStartAssessment(item)}
                  style={styles.takeBtn}
                />
              </View>
            </Card>
          ))}
        </View>
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
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    marginBottom: Spacing.md,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  cardList: {
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  cardDesc: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontWeight: '700',
  },
  takeBtn: {
    paddingHorizontal: 16,
  },
});
