import React, { useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { ActivityIllustration } from '../explore/ExploreIllustrations';

export const CLOUDINARY_ACTIVITY_ARTWORK: Record<string, string> = {
  breathing:
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Breathing_qzoajg.png',
  'box-breathing':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Breathing_qzoajg.png',
  '5-4-3-2-1-grounding':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/5-4-3-2-1_Grounding_wapd0t.png',
  'grounding-54321':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/5-4-3-2-1_Grounding_wapd0t.png',
  'micro-movement':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Micro_Movement_qi4ait.png',
  'progressive-muscle-relaxation':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Progressive_Muscle_Relaxation_y04syv.png',
  pmr:
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Progressive_Muscle_Relaxation_y04syv.png',
  'journal-reflection':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Journal_Reflection_vtiez7.png',
  'open-reflection':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Journal_Reflection_vtiez7.png',

  // Read Articles (Official Cloudinary URLs)
  'why-your-breath-is-the-fastest-way-to-feel-calmer':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Why_Your_Breath_Is_the_Fastest_Way_to_Feel_Calmer_l5sdrf.png',
  'why-your-breath':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Why_Your_Breath_Is_the_Fastest_Way_to_Feel_Calmer_l5sdrf.png',
  'what-exam-season-actually-does-to-your-body':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/What_Exam_Season_Actually_Does_to_Your_Body_vqsyuw.png',
  'what-exam-season-does':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/What_Exam_Season_Actually_Does_to_Your_Body_vqsyuw.png',
  'what-just-one-more-hour-costs-you':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Why_Just_One_More_Hour_Costs_You_More_Than_Sleep_daaafr.png',
  'just-one-more-hour':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Why_Just_One_More_Hour_Costs_You_More_Than_Sleep_daaafr.png',
  'homesick-isnt-small':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Homesick_Isn_t_Small_aebsev.png',
  'the-thoughts-that-loop-at-2am':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/The_Thoughts_That_Loop_at_2_AM_jwfrhj.png',
  'thoughts-that-loop':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/The_Thoughts_That_Loop_at_2_AM_jwfrhj.png',

  // Listen Categories (Official Cloudinary URLs)
  'calm-down':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Calm_Down_dpobfg.png',
  comfort:
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Comfort_u1cahf.png',
  'emotional-release':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Emotional_Release_xw7c8m.png',
  focus:
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Focus_lgk5tj.png',
  'ground-breathe':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Ground_Breathe_js8cns.png',
  'lift-mood':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Lift_Your_Mood_b9tfgd.png',
  'lift-your-mood':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Lift_Your_Mood_b9tfgd.png',
  reflect:
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Reflect_ohmfop.png',
  'sleep-wind-down':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Sleep_Wind_Down_m8ffiw.png',
  'sleep-music':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Sleep_Wind_Down_m8ffiw.png',
};

interface ActivityArtworkProps {
  slug: string;
  size?: number;
}

export const ActivityArtwork: React.FC<ActivityArtworkProps> = ({
  slug,
  size = 150,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageUrl = CLOUDINARY_ACTIVITY_ARTWORK[slug];

  if (!imageUrl || error) {
    // Graceful fallback to SVG illustration if offline or asset missing
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <ActivityIllustration slug={slug} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {loading && (
        <View style={StyleSheet.absoluteFill}>
          <ActivityIndicator size="small" color="#64748B" />
        </View>
      )}
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
