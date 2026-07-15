import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ReportPlaceholder } from '../../components/reports';
import { useReportsStore } from '../../store/reportsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'InstitutionReports'>;
};

export const InstitutionReportsScreen: React.FC<Props> = ({ navigation }) => {
  const loadReport = useReportsStore((s) => s.loadReport);
  const activeReport = useReportsStore((s) => s.activeReport);

  useEffect(() => {
    void loadReport('institution');
  }, [loadReport]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Institution Reports"
        subtitle="Campus analytics placeholder"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Prepared for institution admins and faculty dashboards. No campus data is
        loaded until reporting APIs ship.
      </Text>
      <ReportPlaceholder
        title={activeReport?.title ?? 'Institution Reports'}
        message={
          activeReport?.placeholderMessage ??
          'Campus wellness aggregates, campaign reach, and sentiment reports will live here.'
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
