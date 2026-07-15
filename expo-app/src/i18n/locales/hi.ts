import type { TranslationTree } from './en';
import type { LocalePartial } from './types';

/** Hindi — partial UI coverage; missing keys fall back to English */
const hi: LocalePartial<TranslationTree> = {
  common: {
    retry: 'फिर कोशिश करें',
    cancel: 'रद्द करें',
    continue: 'जारी रखें',
    save: 'सहेजें',
    back: 'वापस',
    loading: 'लोड हो रहा है',
    search: 'खोजें',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    home: 'होम',
    offline: 'आप ऑफ़लाइन हैं',
    error: 'कुछ गलत हो गया',
  },
  tabs: {
    home: 'होम',
    companion: 'साथी',
    mood: 'मूड',
    therapists: 'थेरेपिस्ट',
    profile: 'प्रोफ़ाइल',
    campus: 'कैंपस',
  },
  appearance: {
    title: 'दिखावट',
    fontSize: 'फ़ॉन्ट आकार',
    fontSmall: 'छोटा',
    fontDefault: 'सामान्य',
    fontLarge: 'बड़ा',
    fontXL: 'बहुत बड़ा',
  },
  language: {
    title: 'भाषा',
    subtitle: 'ऐप की भाषा',
    search: 'भाषा खोजें',
  },
};

export default hi;
