/**
 * Static image assets for the application.
 * Design mockups (full-screen Figma exports) are intentionally not used as logos.
 */
import { ImageSourcePropType } from 'react-native';
import { AvatarKey } from '../store/profileStore';

export const CLOUDINARY_BOT_AVATAR_URL =
  'https://res.cloudinary.com/dxoiluua8/image/upload/v1786803445/BOT_ivqhx6.png';

export const CLOUDINARY_BANNER_BG_URL =
  'https://res.cloudinary.com/dxoiluua8/image/upload/v1786789037/Banner_bg_rrixld.png';

export const Images = {
  aiCompanion: { uri: CLOUDINARY_BOT_AVATAR_URL },
  bannerBg: { uri: CLOUDINARY_BANNER_BG_URL },
} as const;

export const getTherapistImage = (_id?: string): ImageSourcePropType | undefined => undefined;

export const getAvatarImage = (key: AvatarKey): ImageSourcePropType | undefined => {
  switch (key) {
    case 'ai-companion':
      return Images.aiCompanion;
    default:
      return Images.aiCompanion;
  }
};

export const getAiCompanionImage = (): ImageSourcePropType => Images.aiCompanion;
