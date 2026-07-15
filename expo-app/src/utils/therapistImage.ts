import { ImageSourcePropType } from 'react-native';
import { getTherapistImage } from '../assets';
import { Therapist } from '../types/domain';

export function isRemoteImageUrl(value: string | null | undefined): value is string {
  return !!value && (value.startsWith('http://') || value.startsWith('https://'));
}

export function getTherapistImageSource(
  therapist: Pick<Therapist, 'id' | 'profileImageUrl'>,
): ImageSourcePropType | undefined {
  if (isRemoteImageUrl(therapist.profileImageUrl)) {
    return { uri: therapist.profileImageUrl };
  }
  return getTherapistImage(therapist.id);
}
