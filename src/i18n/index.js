import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '../constants';

import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.language) : null;
const browserLanguage =
  typeof navigator !== 'undefined' ? (navigator.language || 'en').slice(0, 2) : 'en';
const initialLanguage = ['uz', 'ru', 'en'].includes(savedLanguage)
  ? savedLanguage
  : ['uz', 'ru', 'en'].includes(browserLanguage)
    ? browserLanguage
    : 'en';

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
