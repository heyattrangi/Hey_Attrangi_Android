import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

  return (
    <Screen backgroundColor={Colors.background}>
      <View style={styles.header}>
        <Text variant="heading1" style={styles.headerTitle}>
          Clinical Report
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Score Card */}
        <Card variant="default" style={styles.resultCard}>
          <View style={styles.badgeRow}>
            <Badge variant="brand" label={result.severity.toUpperCase()} />
          </View>

          <Text variant="heading1" style={styles.scoreText}>
            Score: {result.score}
          </Text>

          <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.interpretationText}>
            {result.interpretation}
          </Text>

          {result.recommendation ? (
            <View style={styles.recommendationBox}>
              <Text variant="heading3" style={styles.recommendationTitle}>
                Recommendation
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary}>
                {result.recommendation}
              </Text>
            </View>
          ) : null}
        </Card>

        {/* Clinical Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Icon name={AppIcons.journey} size={16} color={Colors.textMuted} />
          <Text variant="caption" color={Colors.textMuted} style={styles.disclaimerText}>
            This screening result is for self-reflection and personal tracking only — it is not a medical diagnosis.
          </Text>
        </View>

        {/* Return CTA */}
        <Button
          variant="primary"
          label="Return to Dashboard"
          onPress={() => {
            void hapticLight();
            navigation.navigate('MainTabs', { screen: 'HomeTab' });
          }}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xs,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  resultCard: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  interpretationText: {
    fontSize: 15,
    lineHeight: 22,
  },
  recommendationBox: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    gap: 4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  disclaimerText: {
    flex: 1,
  },
});
