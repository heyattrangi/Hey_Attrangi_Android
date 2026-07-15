import React, { useCallback } from 'react';
import { StyleSheet, Text, Linking, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { env } from '../../config/env';
import { APP_VERSION } from '../../constants/appMeta';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'HelpArticle'>;
  route: RouteProp<MainStackParamList, 'HelpArticle'>;
};

const COPY: Record<string, string> = {
  faq: 'Frequently asked questions will live here. Frontend placeholder for Sprint 8.',
  support:
    'Reach our support team from Contact Us. This screen is ready for CMS or helpdesk content.',
  contact: `Email ${env.SUPPORT_EMAIL} or use in-app feedback. Contact form wiring comes with backend.`,
  feedback:
    'Share what is working and what could be kinder. Submissions will sync when the API is ready.',
  'bug-report':
    'Describe the issue, steps to reproduce, and your device. Bug reports are frontend-only for now.',
  'feature-request':
    'Tell us what would make Hey Attrangi more helpful. Requests are stored locally until backend lands.',
  privacy: [
    `Hey Attrangi Privacy Policy — Version ${APP_VERSION} (Release Candidate).`,
    '',
    'Counsel-approved text will replace this summary before public store launch. Until then, this screen documents the intended coverage:',
    '',
    '· What data we collect (account, wellness journals, session metadata)',
    '· How we use AI companionship and why humans may review escalations',
    '· Sharing with therapists you book, and campus partners when enrolled',
    '· Retention, deletion, and your rights (access / export / erase)',
    '· Security practices and how to contact us',
    '',
    `Questions: ${env.SUPPORT_EMAIL}`,
  ].join('\n'),
  terms: [
    `Hey Attrangi Terms of Service — Version ${APP_VERSION} (Release Candidate).`,
    '',
    'These terms are a structural placeholder pending legal review. Intended sections:',
    '',
    '· Eligibility and account responsibilities',
    '· AI companion limitations (not a crisis hotline or medical device)',
    '· Therapy bookings, cancellations, and payments',
    '· Acceptable use and community standards',
    '· Limitation of liability and governing law',
    '',
    `Questions: ${env.SUPPORT_EMAIL}`,
  ].join('\n'),
  about:
    'Hey Attrangi is a mental wellness companion — AI support, therapists, mood intelligence, and journaling in one calm place.',
  licenses:
    'Open-source licenses used in the app will be listed here for transparency.',
};

export const HelpArticleScreen: React.FC<Props> = ({ navigation, route }) => {
  const { slug, title } = route.params;
  const body = COPY[slug] ?? 'Content coming soon.';
  const isPrivacy = slug === 'privacy';
  const isTerms = slug === 'terms';

  const openExternal = useCallback(async (url: string) => {
    void hapticSelection();
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  }, []);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader title={title} onBack={() => navigation.goBack()} />
      <AppCard style={styles.card}>
        <Text style={styles.body} maxFontSizeMultiplier={1.4}>
          {body}
        </Text>
      </AppCard>
      {isPrivacy ? (
        <PrimaryButton
          label="Open hosted Privacy Policy"
          onPress={() => void openExternal(env.PRIVACY_POLICY_URL)}
        />
      ) : null}
      {isTerms ? (
        <PrimaryButton
          label="Open hosted Terms"
          onPress={() => void openExternal(env.TERMS_OF_SERVICE_URL)}
        />
      ) : null}
      {(isPrivacy || isTerms) ? (
        <Pressable
          onPress={() => void openExternal(`mailto:${env.SUPPORT_EMAIL}`)}
          style={styles.mail}
          {...buttonA11y('Email support')}
        >
          <Text style={styles.mailText}>{env.SUPPORT_EMAIL}</Text>
        </Pressable>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.lg },
  body: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  mail: {
    marginTop: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
