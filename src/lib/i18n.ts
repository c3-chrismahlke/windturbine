import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Defer browser-only detector to client runtime to avoid SSR issues
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/common.json';
import es from '../locales/es/common.json';
import zh from '../locales/zh/common.json';
import ar from '../locales/ar/common.json';

const resources = {
  en: { common: en },
  es: { common: es },
  zh: { common: zh },
  ar: { common: ar },
};

// Initialize once (safe in CSR; in SSR add guards)
if (!i18n.isInitialized) {
  const isBrowser = typeof window !== 'undefined';
  const chain = isBrowser ? i18n.use(LanguageDetector) : i18n;
  chain.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'zh', 'ar'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: isBrowser
      ? { order: ['querystring', 'localStorage', 'navigator'], caches: ['localStorage'], lookupQuerystring: 'lang' }
      : undefined,
    returnEmptyString: false,
  });
}

export default i18n;


