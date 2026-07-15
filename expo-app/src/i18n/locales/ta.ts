import type { TranslationTree } from './en';
import type { LocalePartial } from './types';

const ta: LocalePartial<TranslationTree> = {
  common: {
    retry: 'மீண்டும் முயற்சி',
    cancel: 'ரத்து',
    save: 'சேமி',
    back: 'பின்',
    home: 'முகப்பு',
    settings: 'அமைப்புகள்',
    profile: 'சுயவிவரம்',
  },
  tabs: {
    home: 'முகப்பு',
    mood: 'மனநிலை',
    profile: 'சுயவிவரம்',
    campus: 'வளாகம்',
  },
  language: { title: 'மொழி', search: 'மொழிகளைத் தேடு' },
};

export default ta;
