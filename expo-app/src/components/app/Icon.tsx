import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

export { MaterialCommunityIcons };

export const AppIcons = {
  home: 'home-outline',
  homeActive: 'home',
  chat: 'message-text-outline',
  chatActive: 'message-text',
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
} as const;

export type AppIconName = (typeof AppIcons)[keyof typeof AppIcons];

interface IconProps {
  name: AppIconName | string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.textPrimary,
}) => (
  <MaterialCommunityIcons
    name={name as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
    size={size}
    color={color}
  />
);
