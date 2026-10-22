import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FLOATING_NAV_TOKENS } from '../../components/navigation/FloatingBottomTabBar';
import { Icon } from '../../components/app/Icon';
import { CLINICAL_ASSESSMENTS } from '../../data/assessmentsData';
import { MainStackParamList } from '../../navigation/types';
import { AppScreen } from '../../components/app';
import { Colors, Spacing, Radii } from '../../design-system';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import { wellnessRepository } from '../../repositories/WellnessRepository';
import {
  ExploreHeader,
  ExploreTabSwitcher,
  EXPLORE_COLORS,
  EXPLORE_METRICS,
  ExploreCard,
  ActivityIllustration,
  AssessmentCard,
  AssessmentHero,
  ExploreCardStack,
} from '../../components/explore';
import { ActivityCategoryCard, ActivityDeck, ActivityDeckCardItem } from '../../components/activities';
import { ReadDeck, ReadDeckCardItem, ReadArticleModal } from '../../components/read';
import { ListenDeck, ListenDeckCardItem, ListenCategoryModal } from '../../components/listen';
import { AUDIO_CATEGORIES } from '../../data/musicLibrary';
import { PremiumLimitModal, PremiumCardType } from '../../components/premium/PremiumLimitModal';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type ExploreTabMode = 'activities' | 'read' | 'listen' | 'assessments';

interface ActivityItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  duration: string;
  description: string;
  about: string;
  difficulty: string;
  audioAvailable: string;
  type: string;
  icon: string;
  bg: string;
  iconColor: string;
  relatedSlug?: string;
  relatedTitle?: string;
  relatedDuration?: string;
}

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  content: string;
}

interface TrackItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  artist: string;
  duration: string;
  description: string;
  audioSrc?: string;
  image?: string;
}

interface AudioCategoryItem {
  id: string;
  title: string;
  subtitle: string;
  trackCount: number;
  bg: string;
  tracks: TrackItem[];
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    slug: 'breathing',
    category: 'Breathing',
    duration: '1–5 min',
    description: 'A steady four-count rhythm. Inhale, hold, exhale, hold — one easy box at a time.',
    about: 'Used by navy seals and athletes to regain calm and composure under high stress.',
    difficulty: 'Gentle',
    audioAvailable: 'Optional',
    type: 'Guided breathing',
    icon: 'wind',
    bg: '#E0F2FE',
    iconColor: '#0284C7',
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding',
    slug: '5-4-3-2-1-grounding',
    category: 'Grounding',
    duration: '4 min',
    description: 'Name what you see, touch, hear, smell, and taste.',
    about: 'A gentle sensory check-in that invites you to notice what is around you right now. Move through each sense at your own pace, without needing to get anything perfect.',
    difficulty: 'Beginner',
    audioAvailable: 'Optional',
    type: 'Sensory grounding',
    icon: 'eye',
    bg: '#DCFCE7',
    iconColor: '#16A34A',
    relatedSlug: 'micro-movement',
    relatedTitle: 'Micro Movement',
    relatedDuration: '3 min',
  },
  {
    id: 'micro-movement',
    title: 'Micro Movement',
    slug: 'micro-movement',
    category: 'Grounding',
    duration: '3 min',
    description: 'Tiny, gentle movements to reconnect with your body.',
    about: 'Small, easy movements you can do almost anywhere. A way to reconnect with your body through soft stretches and shifts, without strain or pressure.',
    difficulty: 'Gentle',
    audioAvailable: 'No',
    type: 'Body awareness',
    icon: 'activity',
    bg: '#FEF3C7',
    iconColor: '#D97706',
    relatedSlug: '5-4-3-2-1-grounding',
    relatedTitle: '5-4-3-2-1 Grounding',
    relatedDuration: '4 min',
  },
  {
    id: 'progressive-muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    slug: 'progressive-muscle-relaxation',
    category: 'Relaxation',
    duration: '6 min',
    description: 'Tense and release muscle groups to invite ease.',
    about: 'Gently tense and release different muscle groups. The contrast can help you notice where you are holding on, and give those areas a chance to soften.',
    difficulty: 'Intermediate',
    audioAvailable: 'Optional',
    type: 'Guided relaxation',
    icon: 'check-square',
    bg: '#F3E8FF',
    iconColor: '#9333EA',
  },
  {
    id: 'journal-reflection',
    title: 'Journal Reflection',
    slug: 'journal-reflection',
    category: 'Journaling',
    duration: '5 min',
    description: 'A quiet prompt to write whatever is on your mind.',
    about: 'A short writing space with a simple prompt. You can jot a few lines or more - whatever feels useful. There is no need for polish or a particular outcome.',
    difficulty: 'Beginner',
    audioAvailable: 'No',
    type: 'Reflection',
    icon: 'edit-3',
    bg: '#FFF7ED',
    iconColor: '#EA580C',
  },
];

export const LISTEN_CATEGORIES_DECK: ListenDeckCardItem[] = AUDIO_CATEGORIES.map((c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  description: c.description,
  trackCount: c.tracks.length,
  backgroundColor: c.backgroundColor,
  circleBg: c.circleBg,
}));

export const READ_ARTICLES_DECK: ReadDeckCardItem[] = [
  {
    id: 'why-your-breath-is-the-fastest-way-to-feel-calmer',
    slug: 'why-your-breath-is-the-fastest-way-to-feel-calmer',
    title: 'Why Your Breath Is the Fastest Way to Feel Calmer',
    subtitle: "The one tool you're always carrying, and why it works faster than almost anything else.",
    category: 'Breathing',
    readTime: '1 min',
    backgroundColor: EXPLORE_COLORS.orange,
    content:
      "When something stresses you out, your body reacts before your mind even finishes the thought. Your heart rate climbs, your muscles tighten, and your breathing gets shorter and higher in your chest. This isn't something going wrong with you. It's your nervous system doing exactly what it evolved to do: preparing you to react quickly.\n\nThe useful part is that this response runs in both directions. Just as stress changes your breathing, changing your breathing can calm the stress response back down. Slow, deep exhales in particular signal to your body that the moment of danger has passed. This is the whole idea behind the breathing exercises in Explore: box breathing, the 4-7-8 pattern, belly breathing, even a single long sigh. None of these are tricks. They're a direct line to the part of your nervous system that decides whether you feel wound up or settled.\n\nWhat makes breath more useful than most other calming tools is that it's always available. You don't need privacy, an app, or five free minutes on some techniques -- a physiological sigh (two short inhales through the nose, one long exhale through the mouth) takes under thirty seconds and can be done sitting in a lecture hall without anyone noticing.\n\nIt won't erase the thing that stressed you out. An exam is still an exam, a hard conversation is still hard. What it does is bring your body back to a state where you can actually think clearly about it, instead of reacting from a place of alarm. That's the whole point -- not to feel nothing, but to feel steady enough to handle what's actually in front of you.",
  },
  {
    id: 'what-exam-season-actually-does-to-your-body',
    slug: 'what-exam-season-actually-does-to-your-body',
    title: 'What Exam Season Actually Does to Your Body',
    subtitle: "It's not just in your head -- here's what's happening physically, and why it eases.",
    category: 'Academic stress',
    readTime: '1 min',
    backgroundColor: EXPLORE_COLORS.blue,
    content:
      "Exam season has a way of making everything feel urgent at once. What's easy to miss is that a lot of what you're feeling isn't really about any single exam -- it's your body running on a stress response that doesn't know how to switch off between deadlines.\n\nWhen you're under sustained pressure, your body keeps a baseline level of stress hormones elevated for longer than any one stressful moment lasts. That's why you can feel tense hours after actually revising -- lying in bed, eating lunch, half-listening to a friend talk about something unrelated. The trigger has passed, but your body hasn't been given a clear signal that it's safe to come down from alert mode.\n\nThis shows up in ordinary, recognizable ways: trouble concentrating even when you have the time to focus, a shorter fuse than usual, appetite or sleep that feels off in either direction, and a background hum of unease that doesn't attach to anything specific. None of this means something is wrong with you. It means your body is doing exactly what stress responses do when they don't get a clear 'stand down' signal.\n\nThe good news is that signal doesn't have to come from the exam ending. Deliberate downshifting -- a short grounding exercise between revision blocks, a body scan before sleep, even just naming out loud what's actually stressing you rather than letting it stay a vague cloud -- gives your nervous system the cue it's otherwise waiting for. You don't have to wait for exams to be over to feel like yourself again.",
  },
  {
    id: 'what-just-one-more-hour-costs-you',
    slug: 'what-just-one-more-hour-costs-you',
    title: "Why 'Just One More Hour' Costs You More Than Sleep",
    subtitle: 'The revision-all-nighter trade-off nobody explains clearly enough.',
    category: 'Sleep',
    readTime: '1 min',
    backgroundColor: EXPLORE_COLORS.purple,
    content:
      "There's a specific kind of logic that shows up the night before something big: if I just stay up a little longer, I'll know the material better, and that will matter more than being tired tomorrow. It feels like a reasonable trade. It usually isn't.\n\nSleep isn't just downtime for your body -- it's when your brain does a lot of its actual work of consolidating what you learned that day, moving it from short-term into longer-term memory. Cutting sleep short doesn't just make you tired the next day; it can undercut the very studying you stayed up to protect, because the material never gets fully filed away.\n\nOn top of that, a sleep-deprived brain is worse at exactly the things exams ask for: recalling specific details, holding multiple ideas in mind at once, noticing when an answer doesn't quite make sense. You can know the material and still perform worse simply because the tool you're using to access it -- your rested brain -- isn't the one you brought into the room.\n\nNone of this is an argument for pretending the workload isn't real. It's a case for treating sleep as part of the studying, not the thing you sacrifice to make room for it. If revision is going to run late, protecting even a short, real stretch of sleep before the exam is very often worth more than the extra hour of reading would have been -- even though it never feels that way at 1 a.m.",
  },
  {
    id: 'homesick-isnt-small',
    slug: 'homesick-isnt-small',
    title: "Homesick Isn't Small -- Here's Why It Feels So Big",
    subtitle: 'A normal, common reaction that people rarely talk about honestly.',
    category: 'Transition',
    readTime: '1 min',
    backgroundColor: EXPLORE_COLORS.green,
    content:
      "Homesickness has a way of getting minimized -- by other people, and often by the person feeling it. It gets filed under 'just missing home,' something you're supposed to grow out of within a few weeks of moving away. For a lot of students it doesn't work that way, and there's a real reason for that.\n\nMoving away for college usually means losing several sources of steadiness at once: familiar people, a familiar routine, food that doesn't require thinking, a sense of where you fit in a room. Any one of those changing would ask something of you. All of them changing at the same time, often in the same week, is a genuinely large adjustment -- not a small one you're failing to handle quickly enough.\n\nIt's also common for homesickness to resurface later, not just in the first few weeks -- around exam season, festivals, a hard week, or just an ordinary Tuesday when something small reminds you of home. That's not a sign you haven't adjusted. Adjustment isn't a single finish line; it's something that keeps moving as your life here becomes more real.\n\nWhat tends to help isn't forcing yourself to stop feeling it, but building small anchors in your new routine -- a regular call home, a place on campus that starts to feel familiar, a few people you see often enough that showing up doesn't take effort. None of that erases missing home. It just means home stops being the only place that feels steady.",
  },
  {
    id: 'the-thoughts-that-loop-at-2am',
    slug: 'the-thoughts-that-loop-at-2am',
    title: 'The Thoughts That Loop at 2 AM',
    subtitle: "Why your mind gets loud right when you're trying to sleep, and what actually quiets it.",
    category: 'Sleep',
    readTime: '1 min',
    backgroundColor: EXPLORE_COLORS.yellow,
    content:
      "During the day, you're usually doing something -- in a lecture, talking to someone, scrolling, moving between places. All of that gives your mind somewhere to point itself. At night, lying still in the dark with nothing to do, that same mind doesn't switch off. It just runs without a task, and whatever you were half-avoiding during the day often surfaces first.\n\nThis is why a worry that felt manageable at 3 p.m. can feel enormous at 1 a.m. It's not that the worry actually got bigger. It's that you're now facing it with no distraction, less daylight-brain clarity, and a body that's tired but not settled -- a combination that makes everything feel more urgent and less solvable than it really is.\n\nTrying to reason your way out of a looping thought at that hour rarely works, because the problem isn't really the thought's content -- it's that your nervous system is still in an alert, unsettled state. That's the specific gap a body scan or a slow-paced audio session is built for: not to solve the worry, but to bring your body down from alert mode so your mind has less reason to stay loud.\n\nIf the same thought keeps returning night after night, writing it down earlier in the evening -- even just a line in a journal -- can help, since a lot of what keeps a thought looping is the fear of forgetting to deal with it. Once it's written somewhere, your mind often doesn't need to keep holding onto it quite so tightly.",
  },
];

const ACTIVITY_DISPLAY_TITLE_MAP: Record<string, string> = {
  breathing: 'Breathing',
  '5-4-3-2-1-grounding': 'Grounding',
  'micro-movement': 'Micro Movement',
  'progressive-muscle-relaxation': 'Muscle Relaxation',
  'journal-reflection': 'Journal',
};

const DEFAULT_AUDIO_CATEGORIES: AudioCategoryItem[] = [
  {
    id: 'calm-down',
    title: 'Calm Down',
    subtitle: 'Soothe your system and quiet your mind.',
    trackCount: 5,
    bg: '#E6F4F1',
    tracks: [
      {
        id: 'up-in-the-sky',
        slug: 'up-in-the-sky',
        title: 'Up in the Sky',
        category: 'Calm Down',
        artist: 'AATRANGI MUSIC',
        duration: '5 MIN',
        description: 'Soothe your system and quiet your mind with this audio session.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786209436/Memoraphile_-_Up_in_the_Sky_i90exf.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786599505/Up_in_the_Sky_pg6cxp.png',
      },
      {
        id: 'budding-of-consciousness',
        slug: 'the-budding-of-consciousness',
        title: 'The Budding of Consciousness',
        category: 'Calm Down',
        artist: 'AATRANGI MUSIC',
        duration: '7 MIN',
        description: 'Soothe your system and quiet your mind with this audio session.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786209437/the_budding_of_consciousness_sykg5j.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786599505/The_Budding_of_Consciousness_fcaxbe.png',
      },
    ],
  },
  {
    id: 'comfort',
    title: 'Comfort',
    subtitle: 'Feel safe, warm, and emotionally held.',
    trackCount: 7,
    bg: '#EEF2FF',
    tracks: [
      {
        id: 'deep-blue',
        slug: 'deep-blue',
        title: 'Deep Blue',
        category: 'Comfort',
        artist: 'AATRANGI MUSIC',
        duration: '6 MIN',
        description: 'Feel safe, warm, and emotionally held with comforting melodies.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/deep_blue.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Comfort_u1cahf.png',
      },
      {
        id: 'budding-of-consciousness-comfort',
        slug: 'the-budding-of-consciousness',
        title: 'The Budding of Consciousness',
        category: 'Comfort',
        artist: 'AATRANGI MUSIC',
        duration: '7 MIN',
        description: 'Feel safe, warm, and emotionally held with comforting melodies.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/the_budding_of_consciousness_h6ejyc.mp3',
        image: 'https://res.cloudinary.com/dbjv95prc/image/upload/v1786354611/The_Budding_of_Consciousness_h6ejyc.jpg',
      },
    ],
  },
  {
    id: 'emotional-release',
    title: 'Emotional Release',
    subtitle: 'Allow space for heavy emotions to move through.',
    trackCount: 6,
    bg: '#FFF0ED',
    tracks: [
      {
        id: 'piano-gentle',
        slug: 'emotional-piano',
        title: 'Emotional Piano',
        category: 'Emotional Release',
        artist: 'AATRANGI MUSIC',
        duration: '5 MIN',
        description: 'Soft piano soundscapes for quiet emotional processing.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/emotional_piano.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Emotional_Release_xw7c8m.png',
      },
    ],
  },
  {
    id: 'focus',
    title: 'Focus',
    subtitle: 'Clear mental noise and enter deep work.',
    trackCount: 8,
    bg: '#FEF3C7',
    tracks: [
      {
        id: 'focus-flow',
        slug: 'calm-piano',
        title: 'Calm Piano',
        category: 'Focus',
        artist: 'AATRANGI MUSIC',
        duration: '4 MIN',
        description: 'Steady ambient tones to sustain mental focus.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/calm_piano.mp3',
        image: 'https://res.cloudinary.com/dbjv95prc/image/upload/v1786358298/Calm_Piano_xdcsep.jpg',
      },
    ],
  },
  {
    id: 'ground-breathe',
    title: 'Ground & Breathe',
    subtitle: 'Anchor your nervous system in the present moment.',
    trackCount: 7,
    bg: '#E6F4F1',
    tracks: [
      {
        id: 'forest-ambience',
        slug: 'forest-ambience',
        title: 'Forest Ambience',
        category: 'Ground & Breathe',
        artist: 'AATRANGI MUSIC',
        duration: '8 MIN',
        description: 'Natural forest ambience for grounding.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/forest_ambience.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Ground_Breathe_js8cns.png',
      },
    ],
  },
  {
    id: 'lift-mood',
    title: 'Lift Your Mood',
    subtitle: 'Re-energize your spirit.',
    trackCount: 5,
    bg: '#FFF0ED',
    tracks: [
      {
        id: 'another-august',
        slug: 'another-august',
        title: 'Another August',
        category: 'Lift Your Mood',
        artist: 'AATRANGI MUSIC',
        duration: '4 MIN',
        description: 'Uplifting acoustic composition.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/another_august.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Lift_Your_Mood_b9tfgd.png',
      },
    ],
  },
  {
    id: 'reflect',
    title: 'Reflect',
    subtitle: 'Sit gently with your thoughts.',
    trackCount: 6,
    bg: '#EEF2FF',
    tracks: [
      {
        id: 'contemplation',
        slug: 'contemplation',
        title: 'Contemplation',
        category: 'Reflect',
        artist: 'AATRANGI MUSIC',
        duration: '6 MIN',
        description: 'Deep reflective piano composition.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/contemplation.mp3',
        image: 'https://res.cloudinary.com/dbjv95prc/image/upload/v1786359015/Contemplation_dtzlst.jpg',
      },
    ],
  },
  {
    id: 'sleep-wind-down',
    title: 'Sleep & Wind Down',
    subtitle: 'Drift off into a deep, restful sleep.',
    trackCount: 6,
    bg: '#EEF2FF',
    tracks: [
      {
        id: 'sleep-music',
        slug: 'sleep-music',
        title: 'Sleep Music',
        category: 'Sleep & Wind Down',
        artist: 'AATRANGI MUSIC',
        duration: '20 MIN',
        description: 'Soothing soundscape for deep sleep.',
        audioSrc: 'https://res.cloudinary.com/dxoiluua8/video/upload/v1786539260/sleep_music.mp3',
        image: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Sleep_Wind_Down_m8ffiw.png',
      },
    ],
  },
];

const ACTIVITY_VISUAL_MAP: Record<
  string,
  { bg: string; illustrationSlug: string }
> = {
  breathing: {
    bg: EXPLORE_COLORS.orange,
    illustrationSlug: 'breathing',
  },
  '5-4-3-2-1-grounding': {
    bg: EXPLORE_COLORS.blue,
    illustrationSlug: '5-4-3-2-1-grounding',
  },
  'micro-movement': {
    bg: EXPLORE_COLORS.purple,
    illustrationSlug: 'micro-movement',
  },
  'progressive-muscle-relaxation': {
    bg: EXPLORE_COLORS.green,
    illustrationSlug: 'progressive-muscle-relaxation',
  },
  'journal-reflection': {
    bg: EXPLORE_COLORS.yellow,
    illustrationSlug: 'journal-reflection',
  },
};

const READ_VISUAL_MAP: Record<
  string,
  { bg: string; illustrationSlug: string }
> = {
  'why-your-breath': {
    bg: EXPLORE_COLORS.orange,
    illustrationSlug: 'read-breathing',
  },
  'what-exam-season-does': {
    bg: EXPLORE_COLORS.blue,
    illustrationSlug: 'read-exam',
  },
  'just-one-more-hour': {
    bg: EXPLORE_COLORS.purple,
    illustrationSlug: 'read-sleep',
  },
  'homesick-isnt-small': {
    bg: EXPLORE_COLORS.green,
    illustrationSlug: 'read-homesick',
  },
};

const LISTEN_VISUAL_MAP: Record<
  string,
  { bg: string; illustrationSlug: string }
> = {
  'calm-down': {
    bg: EXPLORE_COLORS.blue,
    illustrationSlug: 'listen-calm',
  },
  comfort: {
    bg: EXPLORE_COLORS.orange,
    illustrationSlug: 'listen-comfort',
  },
  'emotional-release': {
    bg: EXPLORE_COLORS.purple,
    illustrationSlug: 'listen-release',
  },
  focus: {
    bg: EXPLORE_COLORS.yellow,
    illustrationSlug: 'listen-focus',
  },
  'ground-breathe': {
    bg: EXPLORE_COLORS.green,
    illustrationSlug: 'listen-ground-breathe',
  },
  'lift-mood': {
    bg: EXPLORE_COLORS.orange,
    illustrationSlug: 'listen-lift-mood',
  },
  reflect: {
    bg: EXPLORE_COLORS.purple,
    illustrationSlug: 'listen-reflect',
  },
  'sleep-wind-down': {
    bg: EXPLORE_COLORS.blue,
    illustrationSlug: 'listen-sleep',
  },
};

const READ_COLOR_PALETTE = [
  EXPLORE_COLORS.orange,
  EXPLORE_COLORS.blue,
  EXPLORE_COLORS.purple,
  EXPLORE_COLORS.green,
  EXPLORE_COLORS.yellow,
];

const READ_ILLUSTRATION_SLUGS = [
  'read-breathing',
  'read-exam',
  'read-sleep',
  'read-homesick',
  'read-thoughts',
];

const getReadVisualConfig = (slug: string, index: number) => {
  if (READ_VISUAL_MAP[slug]) {
    return READ_VISUAL_MAP[slug];
  }
  return {
    bg: READ_COLOR_PALETTE[index % READ_COLOR_PALETTE.length],
    illustrationSlug: READ_ILLUSTRATION_SLUGS[index % READ_ILLUSTRATION_SLUGS.length],
  };
};

export const WellnessHubScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const profileName = useProfileStore((s) => s.personalInfo.fullName || 'You');

  const [activeTab, setActiveTab] = useState<ExploreTabMode>('activities');

  // Selected State Navigation Layers
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedReadDeckArticle, setSelectedReadDeckArticle] = useState<ReadDeckCardItem | null>(null);
  const [selectedListenDeckCategory, setSelectedListenDeckCategory] = useState<ListenDeckCardItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AudioCategoryItem | null>(null);
  const [selectedAssessmentCategory, setSelectedAssessmentCategory] = useState<string>('All');

  // Premium Limit Modal State
  const [premiumModalVisible, setPremiumModalVisible] = useState<boolean>(false);
  const [premiumCardType, setPremiumCardType] = useState<PremiumCardType | null>(null);

  const triggerPremiumCard = (type: PremiumCardType) => {
    setPremiumCardType(type);
    setPremiumModalVisible(true);
  };

  const checkAssessmentEntitlement = async (): Promise<boolean> => {
    const userPlan = useProfileStore.getState().userPlan;
    const activePlanId = useBillingStore.getState().activePlanId;
    const isPremiumUser =
      activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

    if (isPremiumUser) return true;

    try {
      await useProfileStore.getState().fetchPatientLimits();
    } catch {
      return true; // Infrastructure error -> allow attempt
    }

    const limits = useProfileStore.getState().patientLimits;
    const assessmentUsage = limits?.usage?.assessments;

    if (assessmentUsage) {
      const remaining =
        typeof assessmentUsage.remaining === 'number'
          ? assessmentUsage.remaining
          : parseInt(String(assessmentUsage.remaining), 10);
      const used = assessmentUsage.used;
      const limit =
        typeof assessmentUsage.limit === 'number'
          ? assessmentUsage.limit
          : parseInt(String(assessmentUsage.limit), 10);

      if ((!Number.isNaN(remaining) && remaining <= 0) || (used >= limit && limit > 0)) {
        triggerPremiumCard('ASSESSMENT');
        return false;
      }
    }

    return true;
  };

  // Active Player Modal State
  const [activePlayingTrack, setActivePlayingTrack] = useState<TrackItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  const handleTabChange = (tab: ExploreTabMode) => {
    void hapticSelection();
    setActiveTab(tab);
    setSelectedActivity(null);
    setSelectedArticle(null);
    setSelectedCategory(null);
  };

  const handleOpenTrackPlayer = async (track: TrackItem) => {
    void hapticSelection();
    setActivePlayingTrack(track);

    try {
      if (activePlayingTrack?.id === track.id && playerRef.current) {
        if (isPlaying) {
          playerRef.current.pause();
          setIsPlaying(false);
        } else {
          playerRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      setAudioLoading(true);
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }

      if (!track.audioSrc) {
        Alert.alert('Audio Error', 'Unable to play this track right now.');
        setIsPlaying(false);
        setAudioLoading(false);
        return;
      }

      const audioUri = track.audioSrc;

      const player = createAudioPlayer({ uri: audioUri });
      playerRef.current = player;
      player.play();

      setIsPlaying(true);
      void hapticSuccess();
    } catch {
      setIsPlaying(false);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleTogglePlayPause = () => {
    if (!playerRef.current) return;
    void hapticLight();
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleBeginActivity = (act: ActivityItem) => {
    void hapticSelection();
    if (act.slug === '5-4-3-2-1-grounding' || act.slug === 'grounding-54321') {
      navigation.navigate('GroundingExercise');
    } else if (act.slug === 'micro-movement') {
      navigation.navigate('MicroMomentsExercise');
    } else if (act.slug === 'progressive-muscle-relaxation' || act.slug === 'pmr') {
      navigation.navigate('PMRExercise');
    } else if (act.slug === 'journal-reflection' || act.category === 'Journaling') {
      navigation.navigate('JournalReflectionExercise');
    } else {
      navigation.navigate('BreathingExercise', { exerciseId: act.slug as any });
    }
  };

  const initials = (profileName || 'You')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // RENDER: ACTIVITY DETAIL SCREEN (Screenshots 20, 23, 25)
  if (selectedActivity) {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContainer}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => {
              void hapticLight();
              setSelectedActivity(null);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={20} color="#4B5563" />
            <Text style={styles.backLabel}>BACK</Text>
          </TouchableOpacity>

          {/* Large Square Icon */}
          <View style={[styles.largeIconCard, { backgroundColor: selectedActivity.bg }]}>
            <Icon name={selectedActivity.icon as any} size={48} color={selectedActivity.iconColor} />
          </View>

          {/* Category & Duration Row */}
          <View style={styles.pillsRow}>
            <View style={styles.categoryBadgePill}>
              <Text style={styles.categoryBadgeText}>{selectedActivity.category}</Text>
            </View>
            <Text style={styles.dotDurationText}>• {selectedActivity.duration}</Text>
          </View>

          {/* Title & Description */}
          <Text style={styles.detailTitle}>{selectedActivity.title}</Text>
          <Text style={styles.detailSub}>{selectedActivity.description}</Text>

          {/* ABOUT THIS ACTIVITY */}
          <Text style={styles.sectionHeaderLabel}>ABOUT THIS ACTIVITY</Text>
          <Text style={styles.aboutBodyText}>{selectedActivity.about}</Text>

          {/* ACTIVITY INFORMATION Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>ACTIVITY INFORMATION</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{selectedActivity.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estimated Duration</Text>
              <Text style={styles.infoValue}>{selectedActivity.duration}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={styles.infoValue}>{selectedActivity.difficulty}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Audio Available</Text>
              <Text style={styles.infoValue}>{selectedActivity.audioAvailable}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{selectedActivity.type}</Text>
            </View>
          </View>

          {/* Begin CTA */}
          <TouchableOpacity
            style={styles.beginCtaBtn}
            onPress={() => handleBeginActivity(selectedActivity)}
            activeOpacity={0.85}
          >
            <Text style={styles.beginCtaText}>Begin</Text>
          </TouchableOpacity>

          {/* RELATED ACTIVITIES */}
          {selectedActivity.relatedTitle ? (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionHeaderLabel}>RELATED ACTIVITIES</Text>
              <TouchableOpacity
                style={styles.relatedCard}
                onPress={() => {
                  const found = ACTIVITIES.find((a) => a.title === selectedActivity.relatedTitle);
                  if (found) setSelectedActivity(found);
                }}
              >
                <Text style={styles.relatedTitle}>{selectedActivity.relatedTitle}</Text>
                <Text style={styles.relatedDuration}>{selectedActivity.relatedDuration}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </AppScreen>
    );
  }

  // RENDER: ARTICLE READER SCREEN (Screenshots 15, 16)
  if (selectedArticle) {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articleReaderContainer}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => {
              void hapticLight();
              setSelectedArticle(null);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={20} color="#4B5563" />
            <Text style={styles.backArticleText}>Back to Explore</Text>
          </TouchableOpacity>

          <Text style={styles.articleHeadline}>{selectedArticle.title}</Text>
          <Text style={styles.articleSubhead}>{selectedArticle.subtitle}</Text>

          <View style={styles.articlePillsRow}>
            <View style={styles.categoryBadgePill}>
              <Text style={styles.categoryBadgeText}>{selectedArticle.category}</Text>
            </View>
            <View style={styles.readTimePill}>
              <Text style={styles.readTimePillText}>{selectedArticle.readTime}</Text>
            </View>
          </View>

          <View style={styles.dividerLine} />

          <Text style={styles.articleBodyContent}>{selectedArticle.content}</Text>
        </ScrollView>
      </AppScreen>
    );
  }

  // RENDER: AUDIO PLAYER FULL SCREEN (Screenshots 10, 12, 13)
  if (activePlayingTrack) {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        <View style={styles.playerScreenContainer}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => {
              void hapticLight();
              setActivePlayingTrack(null);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={20} color="#4B5563" />
            <Text style={styles.backLabel}>Explore</Text>
          </TouchableOpacity>

          <View style={styles.playerContent}>
            <View style={styles.playerBadge}>
              <Text style={styles.playerBadgeText}>{activePlayingTrack.duration} LISTEN</Text>
            </View>

            <Text style={styles.playerTrackTitle}>{activePlayingTrack.title}</Text>
            <Text style={styles.playerTrackDesc}>{activePlayingTrack.description}</Text>

            {/* Artwork Card */}
            <View style={styles.playerArtworkCard}>
              <Image
                source={{
                  uri:
                    activePlayingTrack.image ||
                    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Calm_Down_dpobfg.png',
                }}
                style={styles.playerArtworkImage}
              />
            </View>

            {/* Progress Bar */}
            <View style={styles.playerProgressSection}>
              <View style={styles.playerProgressBarTrack}>
                <View style={[styles.playerProgressBarFill, { width: isPlaying ? '35%' : '5%' }]} />
              </View>
              <View style={styles.playerTimeRow}>
                <Text style={styles.playerTimeText}>{isPlaying ? '0:45' : '0:00'}</Text>
                <Text style={styles.playerTimeText}>3:54</Text>
              </View>
            </View>

            {/* Player Controls */}
            <View style={styles.playerControlsRow}>
              <TouchableOpacity onPress={() => void hapticLight()}>
                <Icon name="rewind-10" size={22} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => void hapticLight()}>
                <Icon name="chevron-left" size={28} color="#111827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainPlayPauseCircle}
                onPress={handleTogglePlayPause}
                activeOpacity={0.85}
              >
                <Icon
                  name={audioLoading ? 'reload' : isPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => void hapticLight()}>
                <Icon name="chevron-right" size={28} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => void hapticLight()}>
                <Icon name="fast-forward-10" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AppScreen>
    );
  }

  // RENDER: AUDIO CATEGORY TRACK LISTING SCREEN (Screenshots 11, 14)
  if (selectedCategory) {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.categoryDetailContainer}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => {
              void hapticLight();
              setSelectedCategory(null);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={18} color="#6B7280" />
            <Text style={styles.backCategoriesLabel}>BACK TO CATEGORIES</Text>
          </TouchableOpacity>

          <View style={styles.categoryTitleHeaderRow}>
            <Text style={styles.categoryDetailTitle}>{selectedCategory.title}</Text>
            <View style={styles.tracksCountBadge}>
              <Text style={styles.tracksCountText}>{selectedCategory.trackCount} TRACKS</Text>
            </View>
          </View>
          <Text style={styles.categoryDetailSub}>{selectedCategory.subtitle}</Text>

          {/* Track List */}
          <View style={styles.trackListGap}>
            {selectedCategory.tracks.map((track) => {
              const isCurrentTrack = false;
              const isCurrentTrackPlaying = false;
              return (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.trackListItemCard,
                    isCurrentTrack && styles.trackListItemCardActive,
                  ]}
                  onPress={() => handleOpenTrackPlayer(track)}
                  activeOpacity={0.85}
                  accessibilityLabel={`${track.title}, ${track.artist}, ${track.duration}${isCurrentTrackPlaying ? ', currently playing' : ''}`}
                >
                  <Image
                    source={{
                      uri:
                        track.image ||
                        'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Calm_Down_dpobfg.png',
                    }}
                    style={styles.trackListSquareImg}
                  />
                  <View style={styles.trackListMeta}>
                    <Text style={styles.trackListTitle}>{track.title}</Text>
                    <Text style={styles.trackListArtist}>
                      {track.artist} • {track.duration}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.playIconCircle,
                      isCurrentTrackPlaying && styles.playIconCircleActive,
                    ]}
                  >
                    <Icon
                      name={isCurrentTrackPlaying ? 'pause' : 'play'}
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </AppScreen>
    );
  }

  // MAIN EXPLORE HUB SCREEN
  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: EXPLORE_COLORS.background }}>
      {/* Reusable Compact Explore Header */}
      <ExploreHeader title="Explore" />

      {/* Reusable 4-Tab Switcher */}
      <ExploreTabSwitcher
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.mainHubContent,
          {
            paddingBottom:
              FLOATING_NAV_TOKENS.CONTENT_BOTTOM_INSET +
              (Platform.OS === 'ios' ? insets.bottom : 0),
          },
        ]}
      >
        {/* TAB 1: ACTIVITIES */}
        {activeTab === 'activities' ? (
          <ActivityDeck
            onSelectActivity={(deckItem) => {
              void hapticSelection();
              const matched = ACTIVITIES.find(
                (a) => a.slug === deckItem.slug || a.id === deckItem.id,
              );
              const actItem: ActivityItem = (matched || {
                id: deckItem.id,
                title: deckItem.title,
                slug: deckItem.slug,
                duration: deckItem.duration,
                category: 'Breathing',
                description: '',
                type: 'interactive',
                about: '',
                difficulty: 'beginner',
                audioAvailable: false,
              }) as ActivityItem;
              handleBeginActivity(actItem);
            }}
          />
        ) : null}

        {/* TAB 2: READ */}
        {activeTab === 'read' ? (
          <ReadDeck
            articles={READ_ARTICLES_DECK}
            onSelectArticle={(art) => {
              void hapticSelection();
              navigation.navigate('ReadArticleDetail', { article: art });
            }}
          />
        ) : null}

        {/* TAB 3: LISTEN */}
        {activeTab === 'listen' ? (
          <ListenDeck
            categories={LISTEN_CATEGORIES_DECK}
            onSelectCategory={(cat) => {
              void hapticSelection();
              navigation.navigate('ListenCategoryDetail', { category: cat });
            }}
          />
        ) : null}

        {/* TAB 4: ASSESSMENTS */}
        {activeTab === 'assessments' ? (
          <View
            style={{
              paddingHorizontal: EXPLORE_METRICS.horizontalMargin,
              paddingBottom:
                FLOATING_NAV_TOKENS.CONTENT_BOTTOM_INSET +
                (Platform.OS === 'ios' ? insets.bottom : 0),
            }}
          >
            <AssessmentHero
              onStartDynamicPress={() => {
                void hapticSelection();
                navigation.navigate('DynamicAssessment');
              }}
            />

            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.assessmentCategoryRow}
            >
              {[
                'All',
                'Depression',
                'Anxiety',
                'ADHD',
                'OCD',
                'PTSD',
                'Stress',
                'Wellbeing',
                'Safety',
                'Self-Esteem',
                'Substance Use',
              ].map((cat) => {
                const isActive = selectedAssessmentCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setSelectedAssessmentCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.assessmentListContainer}>
              {CLINICAL_ASSESSMENTS.filter((item) =>
                selectedAssessmentCategory === 'All'
                  ? true
                  : item.category.toLowerCase() === selectedAssessmentCategory.toLowerCase(),
              ).map((item) => (
                <AssessmentCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  shortName={item.shortName}
                  description={item.description}
                  time={item.time}
                  category={item.category}
                  onPress={async () => {
                    void hapticSelection();
                    const allowed = await checkAssessmentEntitlement();
                    if (!allowed) return;
                    navigation.navigate('AssessmentRunner', { assessmentKey: item.id });
                  }}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Read Article Modal Reader */}
      <ReadArticleModal
        article={selectedReadDeckArticle}
        visible={Boolean(selectedReadDeckArticle)}
        onClose={() => setSelectedReadDeckArticle(null)}
      />

      {/* Listen Category Modal Player */}
      <ListenCategoryModal
        category={selectedListenDeckCategory}
        visible={Boolean(selectedListenDeckCategory)}
        onClose={() => setSelectedListenDeckCategory(null)}
      />

      {/* Premium Limit Modal */}
      <PremiumLimitModal
        visible={premiumModalVisible}
        cardType={premiumCardType}
        onDismiss={() => setPremiumModalVisible(false)}
        onUpgrade={() => {
          setPremiumModalVisible(false);
          navigation.navigate('SubscriptionComparison');
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  menuCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A2E1B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreMainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A2E1B',
  },
  segmentedBarWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  segmentedBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    padding: 3,
  },
  segmentTabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radii.pill,
  },
  segmentTabItemActive: {
    backgroundColor: '#4A2E1B',
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  segmentTabTextActive: {
    color: '#FFFFFF',
  },
  mainHubContent: {
    paddingHorizontal: 0,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl * 2,
  },
  cardsList: {
    gap: Spacing.md,
  },
  activityCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: 6,
  },
  activityCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  activityCardDuration: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  activityCardDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },

  /* Read Tab */
  articleCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  articleCardHeadline: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 24,
  },
  articleCardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadgePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  articleCardReadTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },

  /* Listen Tab 2-Column Grid */
  listenTwoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  audioCategoryCard: {
    width: '47.5%',
    height: 140,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  categoryCardTracks: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },

  /* Activity Detail Screen */
  detailContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  largeIconCard: {
    width: 90,
    height: 90,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  dotDurationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  detailSub: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  sectionHeaderLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  aboutBodyText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  beginCtaBtn: {
    backgroundColor: '#FF6B00',
    borderRadius: Radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  beginCtaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  relatedSection: {
    marginTop: Spacing.md,
  },
  relatedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  relatedDuration: {
    fontSize: 13,
    color: '#6B7280',
  },

  /* Article Reader */
  articleReaderContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  backArticleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  articleHeadline: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 34,
    marginBottom: 8,
  },
  articleSubhead: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  articlePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  readTimePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  readTimePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: Spacing.md,
  },
  articleBodyContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 26,
  },

  /* Audio Category Detail Screen */
  categoryDetailContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  backCategoriesLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  categoryTitleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryDetailTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
  },
  tracksCountBadge: {
    backgroundColor: '#818CF8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  tracksCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  categoryDetailSub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: Spacing.lg,
  },
  trackListGap: {
    gap: Spacing.md,
  },
  trackListItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  trackListItemCardActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FF6B00',
  },
  trackListSquareImg: {
    width: 50,
    height: 50,
    borderRadius: Radii.md,
  },
  trackListMeta: {
    flex: 1,
  },
  trackListTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  trackListArtist: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  playIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircleActive: {
    backgroundColor: '#1E293B',
  },

  /* Player Screen */
  playerScreenContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  playerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xl,
  },
  playerBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    marginBottom: Spacing.sm,
  },
  playerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  playerTrackTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  playerTrackDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  playerArtworkCard: {
    width: 240,
    height: 240,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  playerArtworkImage: {
    width: '100%',
    height: '100%',
  },
  playerProgressSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  playerProgressBarTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  playerProgressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
  },
  playerTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  mainPlayPauseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Assessments Banner */
  assessmentsBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  assessmentsBannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  assessmentsBannerSub: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  assessmentCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: 6,
  },
  assessmentCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  quizTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  /* Assessment Category Chips */
  assessmentCategoryRow: {
    paddingVertical: 4,
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  categoryChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  assessmentListContainer: {
    gap: 16,
    paddingTop: 8,
  },
});

