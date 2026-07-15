import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { TemplateCard } from '../../components/journal';
import { useJournalStore } from '../../store/journalStore';
import { MainStackParamList } from '../../navigation/types';
import { Typography, Colors, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'JournalTemplates'>;
};

export const JournalTemplatesScreen: React.FC<Props> = ({ navigation }) => {
  const templates = useJournalStore((s) => s.templates);

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Reflection Templates"
        subtitle="Choose a starting point — backend prompts later"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.hint}>
        Templates prepare structure today. AI Prompt content will be generated later.
      </Text>
      {templates.map((template, index) => (
        <TemplateCard
          key={template.id}
          template={template}
          index={index}
          onPress={(t) =>
            navigation.navigate('JournalEntry', { templateId: t.id })
          }
        />
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
});
