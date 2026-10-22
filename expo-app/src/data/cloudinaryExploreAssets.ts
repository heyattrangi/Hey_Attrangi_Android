/**
 * Canonical Cloudinary Asset Repository for Hey Attrangi Android Explore Module
 * Cloud Name: dxoiluua8
 * Source of Truth: app-heyattrangi
 */

export interface CloudinaryAssetItem {
  id: string;
  slug: string;
  title: string;
  illustrationUrl: string;
}

export const CLOUDINARY_ACTIVITIES_ASSETS: Record<string, string> = {
  breathing: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Breathing_qzoajg.png',
  grounding: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/5-4-3-2-1_Grounding_wapd0t.png',
  'micro-movement': 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Micro_Movement_qi4ait.png',
  pmr: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Progressive_Muscle_Relaxation_y04syv.png',
  journal: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Journal_Reflection_vtiez7.png',
};

export const CLOUDINARY_READ_ASSETS: Record<string, string> = {
  'why-your-breath-is-the-fastest-way-to-feel-calmer':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Why_Your_Breath_Is_the_Fastest_Way_to_Feel_Calmer_l5sdrf.png',
  'what-exam-season-actually-does-to-your-body':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/What_Exam_Season_Actually_Does_to_Your_Body_vqsyuw.png',
  'what-just-one-more-hour-costs-you':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Why_Just_One_More_Hour_Costs_You_More_Than_Sleep_daaafr.png',
  'homesick-isnt-small':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Homesick_Isn_t_Small_aebsev.png',
  'the-thoughts-that-loop-at-2am':
    'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/The_Thoughts_That_Loop_at_2_AM_jwfrhj.png',
};

export const CLOUDINARY_LISTEN_CATEGORY_ASSETS: Record<string, string> = {
  'calm-down': 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528343/Calm_Down_dpobfg.png',
  comfort: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Comfort_u1cahf.png',
  'emotional-release': 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Emotional_Release_xw7c8m.png',
  focus: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Focus_lgk5tj.png',
  'ground-breathe': 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528344/Ground_Breathe_js8cns.png',
  'lift-mood': 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Lift_Your_Mood_b9tfgd.png',
  reflect: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Reflect_ohmfop.png',
  'sleep-wind-down': 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786528345/Sleep_Wind_Down_m8ffiw.png',
};
