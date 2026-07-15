import type { TranslationTree } from './en';
import type { LocalePartial } from './types';

const mr: LocalePartial<TranslationTree> = {
  common: {
    retry: 'पुन्हा प्रयत्न करा',
    cancel: 'रद्द',
    save: 'जतन करा',
    back: 'मागे',
    home: 'होम',
    settings: 'सेटिंग्ज',
    profile: 'प्रोफाइल',
  },
  tabs: {
    home: 'होम',
    mood: 'मूड',
    profile: 'प्रोफाइल',
    campus: 'कॅम्पस',
  },
  language: { title: 'भाषा', search: 'भाषा शोधा' },
};

export default mr;
