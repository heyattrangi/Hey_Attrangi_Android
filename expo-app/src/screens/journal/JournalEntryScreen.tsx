import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { PillButton } from '../../components/ui/PillButton';
import { useJournalStore } from '../../store/journalStore';
import { useMoodStore } from '../../store/moodStore';
import { MainStackParamList } from '../../navigation/types';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Icons,
} from '../../app/design-system';
import { Icon } from '../../components/app/Icon';
import { JournalTemplateId } from '../../types/domain';
import { hapticSelection, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'JournalEntry'>;
  route: RouteProp<MainStackParamList, 'JournalEntry'>;
};

const EMOTION_TAGS = [
  'Calm',
  'Anxious',
  'Grateful',
  'Tired',
  'Hopeful',
  'Overwhelmed',
  'Proud',
  'Lonely',
];

export const JournalEntryScreen: React.FC<Props> = ({ navigation, route }) => {
  const getEntry = useJournalStore((s) => s.getEntry);
  const saveEntry = useJournalStore((s) => s.saveEntry);
  const templates = useJournalStore((s) => s.templates);
  const autosaveLabel = useJournalStore((s) => s.autosaveLabel);
  const setAutosaveLabel = useJournalStore((s) => s.setAutosaveLabel);
  const trackerMoods = useMoodStore((s) => s.trackerMoods);

  const existing = route.params?.entryId
    ? getEntry(route.params.entryId)
    : undefined;
  const template = templates.find(
    (t) => t.id === (route.params?.templateId ?? existing?.templateId),
  );

  const [title, setTitle] = useState(existing?.title ?? template?.title ?? '');
  const [body, setBody] = useState(
    existing?.body ?? (template?.prompt ? `${template.prompt}\n\n` : ''),
  );
  const [moodId, setMoodId] = useState(existing?.moodId ?? 'okay');
  const [tags, setTags] = useState<string[]>(existing?.emotionTags ?? []);
  const [gratitude, setGratitude] = useState(existing?.gratitude ?? '');
  const [highlights, setHighlights] = useState(existing?.highlights ?? '');
  const [challenges, setChallenges] = useState(existing?.challenges ?? '');
  const [lessons, setLessons] = useState(existing?.lessons ?? '');
  const [hasVoice, setHasVoice] = useState(Boolean(existing?.hasVoiceNote));
  const [hasPhoto, setHasPhoto] = useState(Boolean(existing?.hasPhoto));

  const dirty = useRef(false);
  const entryId = useRef(existing?.id);

  useEffect(() => {
    dirty.current = true;
  }, [title, body, moodId, tags, gratitude, highlights, challenges, lessons]);

  // Autosave draft UI every ~4s when dirty
  useEffect(() => {
    const id = setInterval(() => {
      if (!dirty.current) return;
      const saved = saveEntry({
        id: entryId.current,
        title: title.trim() || 'Untitled draft',
        body,
        moodId,
        moodLabel: trackerMoods.find((m) => m.id === moodId)?.label,
        emotionTags: tags,
        gratitude: gratitude.trim() || null,
        highlights: highlights.trim() || null,
        challenges: challenges.trim() || null,
        lessons: lessons.trim() || null,
        templateId: (template?.id ?? existing?.templateId) as
          | JournalTemplateId
          | null
          | undefined,
        isDraft: true,
        hasVoiceNote: hasVoice,
        hasPhoto,
      });
      entryId.current = saved.id;
      dirty.current = false;
    }, 4000);
    return () => clearInterval(id);
  }, [
    body,
    challenges,
    existing?.templateId,
    gratitude,
    hasPhoto,
    hasVoice,
    highlights,
    lessons,
    moodId,
    saveEntry,
    tags,
    template?.id,
    title,
    trackerMoods,
  ]);

  useEffect(() => {
    if (!autosaveLabel) return;
    const t = setTimeout(() => setAutosaveLabel(null), 2000);
    return () => clearTimeout(t);
  }, [autosaveLabel, setAutosaveLabel]);

  const moodLabel = useMemo(
    () => trackerMoods.find((m) => m.id === moodId)?.label,
    [moodId, trackerMoods],
  );

  const toggleTag = (tag: string) => {
    void hapticSelection();
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const persist = (asDraft: boolean) => {
    const saved = saveEntry({
      id: entryId.current,
      title: title.trim() || (asDraft ? 'Untitled draft' : 'Untitled'),
      body,
      moodId,
      moodLabel,
      emotionTags: tags,
      gratitude: gratitude.trim() || null,
      highlights: highlights.trim() || null,
      challenges: challenges.trim() || null,
      lessons: lessons.trim() || null,
      templateId: (template?.id ?? existing?.templateId) as
        | JournalTemplateId
        | null
        | undefined,
      isDraft: asDraft,
      hasVoiceNote: hasVoice,
      hasPhoto,
      aiReflection: existing?.aiReflection ?? null,
    });
    entryId.current = saved.id;
    dirty.current = false;
    void hapticSuccess();
    if (!asDraft) {
      navigation.navigate('JournalHome');
    }
  };

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset keyboardAware>
      <AppHeader
        title={existing ? 'Edit entry' : 'New journal entry'}
        subtitle={template ? template.title : 'Free writing'}
        onBack={() => navigation.goBack()}
      />

      {autosaveLabel ? (
        <Text style={styles.autosave} accessibilityLiveRegion="polite">
          {autosaveLabel}
        </Text>
      ) : (
        <Text style={styles.autosaveIdle}>Autosave on</Text>
      )}

      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor={Colors.textMuted}
        value={title}
        onChangeText={setTitle}
        maxFontSizeMultiplier={1.35}
        accessibilityLabel="Entry title"
      />

      <TextInput
        style={styles.bodyInput}
        placeholder="Write freely…"
        placeholderTextColor={Colors.textMuted}
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
        maxFontSizeMultiplier={1.4}
        accessibilityLabel="Journal body"
      />

      <AppCard style={styles.card}>
        <Text style={styles.label}>Mood</Text>
        <View style={styles.rowWrap}>
          {trackerMoods.map((m) => (
            <PillButton
              key={m.id}
              label={m.label}
              selected={moodId === m.id}
              onPress={() => {
                void hapticSelection();
                setMoodId(m.id);
              }}
            />
          ))}
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.label}>Emotion tags</Text>
        <View style={styles.rowWrap}>
          {EMOTION_TAGS.map((tag) => (
            <PillButton
              key={tag}
              label={tag}
              selected={tags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
        </View>
      </AppCard>

      <Field
        label="Gratitude"
        value={gratitude}
        onChangeText={setGratitude}
        placeholder="What are you grateful for?"
      />
      <Field
        label="Highlights of the day"
        value={highlights}
        onChangeText={setHighlights}
        placeholder="Moments that mattered"
      />
      <Field
        label="Challenges"
        value={challenges}
        onChangeText={setChallenges}
        placeholder="What felt hard?"
      />
      <Field
        label="Lessons learned"
        value={lessons}
        onChangeText={setLessons}
        placeholder="What did you learn?"
      />

      <View style={styles.attachRow}>
        <Pressable
          style={[styles.attachBtn, hasVoice && styles.attachActive]}
          onPress={() => {
            void hapticSelection();
            setHasVoice(true);
            Alert.alert(
              'Voice note',
              'Voice capture UI is ready. Recording backend comes later.',
            );
          }}
          accessibilityRole="button"
          accessibilityLabel="Add voice note"
        >
          <Icon name={Icons.mic} size={20} color={Colors.textPrimary} />
          <Text style={styles.attachText}>Voice note</Text>
        </Pressable>
        <Pressable
          style={[styles.attachBtn, hasPhoto && styles.attachActive]}
          onPress={() => {
            void hapticSelection();
            setHasPhoto(true);
            Alert.alert(
              'Photo',
              'Photo attachment UI is ready. Upload backend comes later.',
            );
          }}
          accessibilityRole="button"
          accessibilityLabel="Add photo"
        >
          <Icon name={Icons.image} size={20} color={Colors.textPrimary} />
          <Text style={styles.attachText}>Photo</Text>
        </Pressable>
      </View>

      <AppCard style={styles.aiCard}>
        <Text style={styles.label}>AI Reflection</Text>
        <Text style={styles.aiBody}>
          After you save, AI may offer a gentle reflection here. Backend
          integration later.
        </Text>
      </AppCard>

      <SecondaryButton
        label="Save draft"
        onPress={() => persist(true)}
        size="full"
      />
      <PrimaryButton
        label="Save entry"
        onPress={() => persist(false)}
        showArrow
        style={styles.save}
      />
    </AppScreen>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.fieldInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      multiline
      maxFontSizeMultiplier={1.35}
      accessibilityLabel={label}
    />
  </View>
);

const styles = StyleSheet.create({
  autosave: {
    ...Typography.caption,
    color: Colors.confirmedGreen,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  autosaveIdle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  titleInput: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  bodyInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    minHeight: 160,
    lineHeight: 22,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.xlarge,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  card: { marginBottom: Spacing.md },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  field: { marginBottom: Spacing.md },
  fieldInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    minHeight: 72,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  attachRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  attachBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.sm,
  },
  attachActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  attachText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  aiCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.peachMuted,
  },
  aiBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  save: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
});
