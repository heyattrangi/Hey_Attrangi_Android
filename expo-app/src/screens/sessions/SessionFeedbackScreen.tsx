import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useSessionExperienceStore } from '../../store/sessionExperienceStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, toggleA11y } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'SessionFeedback'>;
  route: RouteProp<MainStackParamList, 'SessionFeedback'>;
};

const EXPERIENCES = ['Calm', 'Supported', 'Neutral', 'Difficult', 'Overwhelming'];

export const SessionFeedbackScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const reduceMotion = useReducedMotion();
  const showToast = useUiStore((s) => s.showToast);
  const feedback = useSessionExperienceStore((s) => s.feedback);
  const updateFeedback = useSessionExperienceStore((s) => s.updateFeedback);
  const submitFeedback = useSessionExperienceStore((s) => s.submitFeedback);
  const reset = useSessionExperienceStore((s) => s.reset);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (feedback.rating < 1) {
      showToast('Please add a rating', 'error');
      return;
    }
    setSaving(true);
    try {
      await submitFeedback();
      showToast('Thank you for your feedback');
      reset();
      navigation.navigate('MainTabs', { screen: 'HomeTab' });
    } catch {
      showToast('Could not save feedback', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Session feedback"
        subtitle={`How was your time with ${route.params.therapistName}?`}
        onBack={() => navigation.goBack()}
      />

      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(Motion.duration.normal)}
      >
        <Text style={styles.label}>Overall rating</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => updateFeedback({ rating: n })}
              {...toggleA11y(`${n} stars`, feedback.rating >= n)}
            >
              <Icon
                name={feedback.rating >= n ? 'star' : 'star-outline'}
                size={36}
                color={Colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Emotional helpfulness</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => updateFeedback({ emotionalHelpfulness: n })}
              {...toggleA11y(`Helpfulness ${n}`, feedback.emotionalHelpfulness >= n)}
            >
              <Icon
                name={
                  feedback.emotionalHelpfulness >= n ? 'heart' : 'heart-outline'
                }
                size={32}
                color={Colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>How did the session feel?</Text>
        <View style={styles.chips}>
          {EXPERIENCES.map((e) => {
            const on = feedback.experience === e;
            return (
              <TouchableOpacity
                key={e}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => updateFeedback({ experience: e })}
                {...toggleA11y(e, on)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppCard style={styles.card}>
          <Text style={styles.label}>Therapist feedback</Text>
          <TextInput
            style={styles.input}
            value={feedback.therapistFeedback}
            onChangeText={(t) => updateFeedback({ therapistFeedback: t })}
            placeholder="What helped most?"
            placeholderTextColor={Colors.textMuted}
            multiline
            accessibilityLabel="Therapist feedback"
          />
          <Text style={styles.label}>Additional notes</Text>
          <TextInput
            style={styles.input}
            value={feedback.notes}
            onChangeText={(t) => updateFeedback({ notes: t })}
            placeholder="Anything else to share (optional)"
            placeholderTextColor={Colors.textMuted}
            multiline
            accessibilityLabel="Additional notes"
          />
        </AppCard>

        <Text style={styles.hint}>Saved locally for now — API later</Text>

        <PrimaryButton
          label="Submit feedback"
          showArrow
          loading={saving}
          onPress={save}
        />
      </Animated.View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
  },
  chipOn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chipTextOn: { color: Colors.primaryDark },
  card: { marginTop: Spacing.md, marginBottom: Spacing.md },
  input: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.medium,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlignVertical: 'top',
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
});
