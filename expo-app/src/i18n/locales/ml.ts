import type { TranslationTree } from './en';
import type { LocalePartial } from './types';

const ml: LocalePartial<TranslationTree> = {
  common: {
    retry: 'വീണ്ടും ശ്രമിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    save: 'സംരക്ഷിക്കുക',
    back: 'തിരികെ',
    home: 'ഹോം',
    settings: 'ക്രമീകരണങ്ങൾ',
    profile: 'പ്രൊഫൈൽ',
  },
  tabs: {
    home: 'ഹോം',
    mood: 'മൂഡ്',
    profile: 'പ്രൊഫൈൽ',
    campus: 'കാമ്പസ്',
  },
  language: { title: 'ഭാഷ', search: 'ഭാഷകൾ തിരയുക' },
};

export default ml;
