export interface MoodOptionDefinition {
  name: 'Low' | 'Meh' | 'Okay' | 'Good' | 'Great';
  score: number;
  imageUrl: string;
  emotionImageUrl: string;
  gradientColors: [string, string];
  primaryColor: string;
  mutedColor: string;
  textLightColor: string;
}

export const CLOUDINARY_MOOD_ASSETS: MoodOptionDefinition[] = [
  {
    name: 'Low',
    score: 0,
    imageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786799140/Low_sujxbx.png',
    emotionImageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786799192/Low-emotion_vbpanv.png',
    gradientColors: ['#E9C9FF', '#D284FA'],
    primaryColor: '#4D179A',
    mutedColor: 'rgba(77, 23, 154, 0.3)',
    textLightColor: '#E9C9FF',
  },
  {
    name: 'Meh',
    score: 1,
    imageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730508/Meh_fh0ndp.png',
    emotionImageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Meh-emotion_nozhzi.png',
    gradientColors: ['#C2DDF8', '#86BDF3'],
    primaryColor: '#024A70',
    mutedColor: 'rgba(2, 74, 112, 0.3)',
    textLightColor: '#C2DDF8',
  },
  {
    name: 'Okay',
    score: 2,
    imageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730508/Okay_ikdsom.png',
    emotionImageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Okay-emotion_sscj34.png',
    gradientColors: ['#FFD5B7', '#FE9E57'],
    primaryColor: '#733E0A',
    mutedColor: 'rgba(115, 62, 10, 0.3)',
    textLightColor: '#FFD5B7',
  },
  {
    name: 'Good',
    score: 3,
    imageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730507/Good_qtm32o.png',
    emotionImageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Good-emotion_jimbfs.png',
    gradientColors: ['#CEF8A4', '#A4F06A'],
    primaryColor: '#132D0E',
    mutedColor: 'rgba(19, 45, 14, 0.3)',
    textLightColor: '#CEF8A4',
  },
  {
    name: 'Great',
    score: 4,
    imageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730508/Great_hbqsmr.png',
    emotionImageUrl: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Great-emotion_rbwtzb.png',
    gradientColors: ['#FCE5AF', '#FFC141'],
    primaryColor: '#733E0A',
    mutedColor: 'rgba(115, 62, 10, 0.3)',
    textLightColor: '#FCE5AF',
  },
];

export const getMoodAssetByScore = (score: number): MoodOptionDefinition => {
  const index = Math.max(0, Math.min(4, Math.floor(score)));
  return CLOUDINARY_MOOD_ASSETS[index] ?? CLOUDINARY_MOOD_ASSETS[2];
};

export const getMoodAssetByName = (name: string): MoodOptionDefinition => {
  const normalized = name?.toLowerCase()?.trim();
  if (normalized === 'low' || normalized === 'very_bad' || normalized === 'very bad' || normalized === 'sad') return CLOUDINARY_MOOD_ASSETS[0];
  if (normalized === 'meh' || normalized === 'heavy' || normalized === 'bad') return CLOUDINARY_MOOD_ASSETS[1];
  if (normalized === 'okay' || normalized === 'neutral' || normalized === 'not bad') return CLOUDINARY_MOOD_ASSETS[2];
  if (normalized === 'good') return CLOUDINARY_MOOD_ASSETS[3];
  if (normalized === 'great' || normalized === 'bright' || normalized === 'happy') return CLOUDINARY_MOOD_ASSETS[4];
  return CLOUDINARY_MOOD_ASSETS[2];
};
