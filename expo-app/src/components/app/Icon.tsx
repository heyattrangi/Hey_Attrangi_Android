import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

export { MaterialCommunityIcons };

export const AppIcons = {
  home: 'home-outline',
  homeActive: 'home',
  explore: 'magnify',
  exploreActive: 'magnify',
  journey: 'chart-line',
  journeyActive: 'chart-line',
  microphone: 'microphone',
  chat: 'message-text-outline',
  chatActive: 'message-text',
  library: 'book-open-variant',
  libraryActive: 'book-open',
  mood: 'emoticon-outline',
  moodActive: 'emoticon',
  therapists: 'account-group-outline',
  therapistsActive: 'account-group',
  profile: 'account-outline',
  profileActive: 'account',
  sessions: 'calendar-clock',
  video: 'video-outline',
  settings: 'cog-outline',
  back: 'arrow-left',
  send: 'send',
  book: 'calendar-plus',
  check: 'check-circle',
  heart: 'heart-outline',
  star: 'star',
  logout: 'logout',
  chevronRight: 'chevron-right',
  empty: 'inbox-outline',
  pencil: 'pencil-outline',
} as const;

export type AppIconName = (typeof AppIcons)[keyof typeof AppIcons];

interface IconProps {
  name: AppIconName | string;
  size?: number;
  color?: string;
}

export function getSafeIconName(name?: string): React.ComponentProps<typeof MaterialCommunityIcons>['name'] {
  if (!name || typeof name !== 'string' || name.trim() === '' || name === '?') {
    return 'help-circle-outline';
  }
  return name.trim() as any;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.textPrimary,
}) => {
  const safeName = getSafeIconName(name);
  return (
    <MaterialCommunityIcons
      name={safeName}
      size={size}
      color={color}
    />
  );
};
