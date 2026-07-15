import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ReportPlaceholder } from '../../components/reports';
import { useReportsStore } from '../../store/reportsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ParentReports'>;
};

export const ParentReportsScreen: React.FC<Props> = ({ navigation }) => {
  const loadReport = useReportsStore((s) => s.loadReport);
  const activeReport = useReportsStore((s) => s.activeReport);

  useEffect(() => {
    void loadReport('parent');
  }, [loadReport]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Parent Reports"
        subtitle="Guardian sharing placeholder"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Parent role is not enabled yet. This screen reserves the sharing
        experience with consent-aware summaries.
      </Text>
      <ReportPlaceholder
        title={activeReport?.title ?? 'Parent Reports'}
        message={
          activeReport?.placeholderMessage ??
          'Shared mood and session summaries will appear here when parent access launches.'
        }
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
});
