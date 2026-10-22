import { HomeMoodOption, MoodHistoryChartEntry, MoodTagOption, MoodTrackerOption } from '../types/domain';

export const mockMoodTrackerOptions: MoodTrackerOption[] = [
  { id: 'terrible', label: 'Terrible' },
  { id: 'bad', label: 'Bad' },
  { id: 'okay', label: 'Okay' },
  { id: 'good', label: 'Good' },
  { id: 'happy', label: 'Happy' },
];

export const mockMoodTags: MoodTagOption[] = [
  'Depression',
  'Stress',
  'Anxiety',
  'Overwhelm',
  'Sensory overload',
  'Masking',
  'Social Fatigue',
  'Sleep',
  'Burnout',
  'Focused',
];

export const mockHomeMoods: HomeMoodOption[] = [
  { id: 'sad', label: 'Sad' },
  { id: 'bad', label: 'Bad' },
  { id: 'not_bad', label: 'Not bad' },
  { id: 'good', label: 'Good' },
  { id: 'happy', label: 'Happy' },
];

export const mockMoodHistoryChart: MoodHistoryChartEntry[] = [
  { date: 'Mon', mood: 'Calm' },
  { date: 'Tue', mood: 'Happy' },
  { date: 'Wed', mood: 'Okay' },
  { date: 'Thu', mood: 'Calm' },
  { date: 'Fri', mood: 'Happy' },
  { date: 'Sat', mood: 'Okay' },
  { date: 'Sun', mood: 'Calm' },
];
