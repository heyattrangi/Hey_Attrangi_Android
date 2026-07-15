import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { AppScreen, AppCard } from '../../components/app';
import { PillButton } from '../../components/ui/PillButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { MoodSavedState } from '../../components/ui-states';
import {
  IntensitySlider,
  MetricScale,
  StreakBanner,
} from '../../components/mood';
import { useMoodStore } from '../../store/moodStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
} from '../../app/design-system';
import { computeMoodAnalytics } from '../../services/mood/moodAnalytics';
import { hapticSelection } from '../../utils/haptics';

type MoodNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'MoodTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const QUOTE =
  "You don't have to control your thoughts. You just have to stop letting them control you.";

/** Design: Mood tracker (scrollable).png — Daily Mood Check-In */
export const MoodTrackingScreen: React.FC = () => {
  const navigation = useNavigation<MoodNav>();
  const addLog = useMoodStore((s) => s.addLog);
  const trackerMoods = useMoodStore((s) => s.trackerMoods);
  const moodTags = useMoodStore((s) => s.moodTags);
  const history = useMoodStore((s) => s.history);
  const showToast = useUiStore((s) => s.showToast);

  const [mood, setMood] = useState('okay');
  const [intensity, setIntensity] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [energy, setEnergy] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [social, setSocial] = useState<number | null>(null);
  const [productivity, setProductivity] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const streak = computeMoodAnalytics(history).streak;

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const toggleTag = (tag: string) => {
    void hapticSelection();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      void hapticSelection();
      setSelectedTags((prev) => [...prev, trimmed]);
      setCustomTag('');
    }
  };

  const handleSave = async () => {
    const moodLabel = trackerMoods.find((m) => m.id === mood)?.label ?? mood;
    try {
      await addLog({
        mood,
        moodLabel,
        intensity,
        tags: selectedTags,
        notes: notes.trim() || null,
        gratitude: gratitude.trim() || null,
        energy,
        stress,
        sleep,
        social,
        productivity,
      });
      setSaved(true);
    } catch {
      const message =
        useMoodStore.getState().error?.message ?? 'Failed to save mood log';
      showToast(message, 'error');
    }
  };

  if (saved) {
    return (
      <AppScreen scrollable={false} gradient="topRightWarm">
        <MoodSavedState
          onViewHistory={() => navigation.navigate('MoodHistory')}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen gradient="topRightWarm">
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            Mood Tracker
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
            Understand your feelings one day at a time.
          </Text>
        </View>
        <SecondaryButton
          label="History"
          onPress={() => navigation.navigate('MoodHistory')}
          size="compact"
        />
      </View>

      <View style={styles.quickLinks}>
        <Pressable
          style={styles.quickChip}
          onPress={() => navigation.navigate('MoodAnalytics')}
        >
          <Text style={styles.quickChipText}>Analytics</Text>
        </Pressable>
        <Pressable
          style={styles.quickChip}
          onPress={() => navigation.navigate('MoodCalendar')}
        >
          <Text style={styles.quickChipText}>Calendar</Text>
        </Pressable>
      </View>

      <Text style={styles.date} maxFontSizeMultiplier={1.25}>
        {today}
      </Text>
      <Text style={styles.quote} maxFontSizeMultiplier={1.3}>
        “{QUOTE}”
      </Text>

      {streak.currentStreak > 0 ? (
        <View style={styles.streakWrap}>
          <StreakBanner streak={streak} />
        </View>
      ) : null}

      <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
            How do you feel right now?
          </Text>
          <View style={styles.moodRow}>
            {trackerMoods.map((option) => {
              const selected = mood === option.id;
              return (
                <Animated.View
                  key={option.id}
                  entering={selected ? ZoomIn.duration(Motion.duration.fast) : undefined}
                >
                  <PillButton
                    label={option.label}
                    selected={selected}
                    onPress={() => {
                      void hapticSelection();
                      setMood(option.id);
                    }}
                  />
                </Animated.View>
              );
            })}
          </View>
          <IntensitySlider value={intensity} onChange={setIntensity} />
        </AppCard>
      </Animated.View>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
          What’s going on with you today?
        </Text>
        <Text style={styles.cardHint} maxFontSizeMultiplier={1.25}>
          Choose any that apply, or add your own tag.
        </Text>
        <View style={styles.tagRow}>
          {moodTags.map((tag) => (
            <PillButton
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
          {selectedTags
            .filter((t) => !moodTags.includes(t))
            .map((tag) => (
              <PillButton
                key={tag}
                label={tag}
                selected
                onPress={() => toggleTag(tag)}
              />
            ))}
        </View>
        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            placeholder="Custom emotion"
            placeholderTextColor={Colors.textMuted}
            value={customTag}
            onChangeText={setCustomTag}
            onSubmitEditing={addCustomTag}
            returnKeyType="done"
            maxFontSizeMultiplier={1.3}
            accessibilityLabel="Custom emotion tag"
          />
          <Pressable
            style={styles.addTagBtn}
            onPress={addCustomTag}
            accessibilityRole="button"
            accessibilityLabel="Add custom tag"
          >
            <Text style={styles.addTagText}>+ Add</Text>
          </Pressable>
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
          Notes & gratitude
        </Text>
        <TextInput
          style={[styles.notesInput, styles.notesTall]}
          placeholder="How was your day? (optional)"
          placeholderTextColor={Colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
          maxFontSizeMultiplier={1.35}
          accessibilityLabel="Journal notes"
        />
        <TextInput
          style={styles.notesInput}
          placeholder="One thing you’re grateful for…"
          placeholderTextColor={Colors.textMuted}
          value={gratitude}
          onChangeText={setGratitude}
          maxFontSizeMultiplier={1.35}
          accessibilityLabel="Gratitude prompt"
        />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
          More details
        </Text>
        <MetricScale
          title="How would you rate your energy today?"
          value={energy}
          onChange={setEnergy}
        />
        <MetricScale
          title="How would you rate your stress today?"
          value={stress}
          onChange={setStress}
        />
        <MetricScale
          title="How well did you sleep today?"
          value={sleep}
          onChange={setSleep}
        />
        <MetricScale
          title="How was your social interaction today?"
          value={social}
          onChange={setSocial}
        />
        <MetricScale
          title="How productive did you feel today?"
          value={productivity}
          onChange={setProductivity}
        />
      </AppCard>

      <PrimaryButton label="Save Log" onPress={handleSave} style={styles.save} />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  quickChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
  },
  quickChipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  date: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  quote: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  streakWrap: {
    marginBottom: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
    ...Shadows.low,
  },
  cardTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  cardHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  customRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm + 2 : Spacing.sm,
    minHeight: 44,
    backgroundColor: Colors.surface,
  },
  addTagBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: 44,
    justifyContent: 'center',
  },
  addTagText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  notesInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    minHeight: 44,
    backgroundColor: Colors.surface,
  },
  notesTall: {
    minHeight: 88,
  },
  save: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
});
