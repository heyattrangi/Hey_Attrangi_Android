/**
 * Static image assets for the application.
 * Design mockups (full-screen Figma exports) are intentionally not used as logos.
 */
import { ImageSourcePropType } from 'react-native';
import { AvatarKey } from '../store/profileStore';

export const Images = {
  therapists: {
    '1': require('../../assets/images/therapist-ananya.png'),
    '2': require('../../assets/images/therapist-devi.png'),
    '3': require('../../assets/images/therapist-rahul.png'),
  },
  aiCompanion: require('../../assets/images/ai-companion.png'),
} as const;

export type TherapistImageId = keyof typeof Images.therapists;

export const getTherapistImage = (id: string) =>
  Images.therapists[id as TherapistImageId];

export const getAvatarImage = (key: AvatarKey): ImageSourcePropType | undefined => {
  switch (key) {
    case 'therapist':
      return Images.therapists['1'];
    case 'ai-companion':
      return Images.aiCompanion;
    default:
      return Images.aiCompanion;
  }
};

export const getAiCompanionImage = (): ImageSourcePropType => Images.aiCompanion;
