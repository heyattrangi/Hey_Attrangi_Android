import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon, AppIcons } from '../../components/app';
import { EmptyStateView } from '../../components/async';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { APP_VERSION } from '../../constants/appMeta';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'HelpCenter'>;
};

const ARTICLES: Array<{
  title: string;
  slug: string;
  group: string;
}> = [
  { group: 'Support', title: 'FAQ', slug: 'faq' },
  { group: 'Support', title: 'Support', slug: 'support' },
  { group: 'Support', title: 'Contact Us', slug: 'contact' },
  { group: 'Feedback', title: 'Feedback', slug: 'feedback' },
  { group: 'Feedback', title: 'Bug Report', slug: 'bug-report' },
  { group: 'Feedback', title: 'Feature Request', slug: 'feature-request' },
  { group: 'Legal', title: 'Privacy Policy', slug: 'privacy' },
  { group: 'Legal', title: 'Terms & Conditions', slug: 'terms' },
  { group: 'About', title: 'About Hey Attrangi', slug: 'about' },
  { group: 'About', title: 'Licenses', slug: 'licenses' },
];

export const HelpCenterScreen: React.FC<Props> = ({ navigation }) => {
  const [showFeedbackEmpty, setShowFeedbackEmpty] = useState(false);
  const groups = ['Support', 'Feedback', 'Legal', 'About'];

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Help Center"
        subtitle="Guides, support, and legal"
        onBack={() => navigation.goBack()}
      />

      {groups.map((group) => (
        <View key={group} style={styles.group}>
          <Text style={styles.section}>{group}</Text>
          {ARTICLES.filter((a) => a.group === group).map((item) => (
            <AppCard
              key={item.slug}
              style={styles.card}
              onPress={() => {
                if (item.slug === 'feedback') {
                  setShowFeedbackEmpty(true);
                }
                navigation.navigate('HelpArticle', {
                  slug: item.slug,
                  title: item.title,
                });
              }}
            >
              <View style={styles.row}>
                <Text style={styles.label}>{item.title}</Text>
                <Icon name={AppIcons.chevronRight} size={22} color={Colors.textMuted} />
              </View>
            </AppCard>
          ))}
        </View>
      ))}

      {showFeedbackEmpty ? (
        <View style={styles.empty}>
          <EmptyStateView
            title="No feedback history"
            message="Your past feedback will show here once you send some."
          />
        </View>
      ) : null}

      <Text style={styles.version} accessibilityLabel={`App version ${APP_VERSION}`}>
        Hey Attrangi v{APP_VERSION}
      </Text>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  group: { marginBottom: Spacing.md },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  empty: { marginVertical: Spacing.md },
  version: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
