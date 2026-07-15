import type { TranslationTree } from './en';
import type { LocalePartial } from './types';

const te: LocalePartial<TranslationTree> = {
  common: {
    retry: 'మళ్లీ ప్రయత్నించండి',
    cancel: 'రద్దు',
    save: 'సేవ్',
    back: 'వెనక్కి',
    home: 'హోమ్',
    settings: 'సెట్టింగులు',
    profile: 'ప్రొఫైల్',
  },
  tabs: {
    home: 'హోమ్',
    mood: 'మూడ్',
    profile: 'ప్రొఫైల్',
    campus: 'క్యాంపస్',
  },
  language: { title: 'భాష', search: 'భాషలను వెతకండి' },
};

export default te;
